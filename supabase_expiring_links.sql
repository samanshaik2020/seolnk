-- Create expiring_links table
create table expiring_links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id),
  slug text unique not null,
  title text,
  original_url text not null,
  expires_at timestamp with time zone not null,
  is_active boolean default true
);

-- Enable RLS
alter table expiring_links enable row level security;

-- Allow public read access
create policy "Public can view expiring_links"
  on expiring_links for select
  using ( true );

-- Allow authenticated users to insert their own links
create policy "Users can insert their own expiring_links"
  on expiring_links for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own links
create policy "Users can update their own expiring_links"
  on expiring_links for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own links
create policy "Users can delete their own expiring_links"
  on expiring_links for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Create analytics table for expiring links
create table expiring_link_analytics (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references expiring_links(id) on delete cascade,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  referrer text,
  user_agent text,
  country text,
  city text
);

-- Enable RLS for analytics
alter table expiring_link_analytics enable row level security;

create policy "Public can view expiring_link_analytics"
  on expiring_link_analytics for select
  using ( true );

create policy "Public can insert expiring_link_analytics"
  on expiring_link_analytics for insert
  with check ( true );
