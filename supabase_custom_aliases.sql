-- Create custom_aliases table
create table custom_aliases (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id),
  alias text unique not null,
  title text,
  original_url text not null,
  is_active boolean default true,
  is_locked boolean default false,
  expires_at timestamp with time zone,
  click_count integer default 0
);

-- Enable RLS
alter table custom_aliases enable row level security;

-- Allow public read access
create policy "Public can view custom_aliases"
  on custom_aliases for select
  using ( true );

-- Allow authenticated users to insert their own aliases
create policy "Users can insert their own custom_aliases"
  on custom_aliases for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own aliases
create policy "Users can update their own custom_aliases"
  on custom_aliases for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own aliases
create policy "Users can delete their own custom_aliases"
  on custom_aliases for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Create analytics table for custom aliases
create table custom_alias_analytics (
  id uuid default gen_random_uuid() primary key,
  alias_id uuid references custom_aliases(id) on delete cascade,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  referrer text,
  user_agent text,
  country text,
  city text
);

-- Enable RLS for analytics
alter table custom_alias_analytics enable row level security;

create policy "Public can view custom_alias_analytics"
  on custom_alias_analytics for select
  using ( true );

create policy "Public can insert custom_alias_analytics"
  on custom_alias_analytics for insert
  with check ( true );

-- Create index for faster alias lookups
create index idx_custom_aliases_alias on custom_aliases(alias);
create index idx_custom_aliases_user_id on custom_aliases(user_id);
