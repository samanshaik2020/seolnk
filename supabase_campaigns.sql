-- Create campaigns (folders) table
create table campaigns (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text default '#6366f1',
  icon text default 'folder',
  is_active boolean default true
);

-- Enable RLS
alter table campaigns enable row level security;

-- Allow users to view their own campaigns
create policy "Users can view their own campaigns"
  on campaigns for select
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to insert their own campaigns
create policy "Users can insert their own campaigns"
  on campaigns for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own campaigns
create policy "Users can update their own campaigns"
  on campaigns for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own campaigns
create policy "Users can delete their own campaigns"
  on campaigns for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Create index for faster lookups
create index idx_campaigns_user_id on campaigns(user_id);

-- Add campaign_id to existing link tables
-- Cards (Link Render)
alter table cards add column campaign_id uuid references campaigns(id) on delete set null;
create index idx_cards_campaign_id on cards(campaign_id);

-- Rotators
alter table rotators add column campaign_id uuid references campaigns(id) on delete set null;
create index idx_rotators_campaign_id on rotators(campaign_id);

-- Expiring Links
alter table expiring_links add column campaign_id uuid references campaigns(id) on delete set null;
create index idx_expiring_links_campaign_id on expiring_links(campaign_id);

-- Password Protected Links
alter table password_protected_links add column campaign_id uuid references campaigns(id) on delete set null;
create index idx_password_protected_links_campaign_id on password_protected_links(campaign_id);

-- Custom Aliases
alter table custom_aliases add column campaign_id uuid references campaigns(id) on delete set null;
create index idx_custom_aliases_campaign_id on custom_aliases(campaign_id);

-- Create view for campaign stats (optional - can be calculated in app)
-- This is a helper function to get campaign statistics
create or replace function get_campaign_stats(p_campaign_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_links', (
      select count(*) from (
        select id from cards where campaign_id = p_campaign_id
        union all
        select id from rotators where campaign_id = p_campaign_id
        union all
        select id from expiring_links where campaign_id = p_campaign_id
        union all
        select id from password_protected_links where campaign_id = p_campaign_id
        union all
        select id from custom_aliases where campaign_id = p_campaign_id
      ) as all_links
    ),
    'cards_count', (select count(*) from cards where campaign_id = p_campaign_id),
    'rotators_count', (select count(*) from rotators where campaign_id = p_campaign_id),
    'expiring_count', (select count(*) from expiring_links where campaign_id = p_campaign_id),
    'protected_count', (select count(*) from password_protected_links where campaign_id = p_campaign_id),
    'aliases_count', (select count(*) from custom_aliases where campaign_id = p_campaign_id)
  ) into result;
  
  return result;
end;
$$ language plpgsql;
