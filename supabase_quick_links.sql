-- Create quick_links table for simple URL storage in campaigns
create table quick_links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  title text not null,
  original_url text not null,
  slug text unique,
  notes text,
  is_active boolean default true,
  click_count integer default 0
);

-- Enable RLS
alter table quick_links enable row level security;

-- Allow public read for redirects
create policy "Public can view quick_links"
  on quick_links for select
  using ( true );

-- Allow authenticated users to insert their own links
create policy "Users can insert their own quick_links"
  on quick_links for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own links
create policy "Users can update their own quick_links"
  on quick_links for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own links
create policy "Users can delete their own quick_links"
  on quick_links for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Create indexes
create index idx_quick_links_user_id on quick_links(user_id);
create index idx_quick_links_campaign_id on quick_links(campaign_id);
create index idx_quick_links_slug on quick_links(slug);

-- Create analytics table for quick links
create table quick_link_analytics (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references quick_links(id) on delete cascade,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  referrer text,
  user_agent text
);

-- Enable RLS for analytics
alter table quick_link_analytics enable row level security;

create policy "Public can view quick_link_analytics"
  on quick_link_analytics for select
  using ( true );

create policy "Public can insert quick_link_analytics"
  on quick_link_analytics for insert
  with check ( true );
