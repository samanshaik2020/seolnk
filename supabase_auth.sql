-- Add user_id to cards table
alter table cards 
add column user_id uuid references auth.users(id);

-- Add user_id to rotators table
alter table rotators 
add column user_id uuid references auth.users(id);

-- Update RLS for cards
alter table cards enable row level security;

-- Allow public read access (already exists, but ensuring)
create policy "Public can view cards"
  on cards for select
  using ( true );

-- Allow authenticated users to insert their own cards
create policy "Users can insert their own cards"
  on cards for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own cards
create policy "Users can update their own cards"
  on cards for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own cards
create policy "Users can delete their own cards"
  on cards for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Update RLS for rotators
-- Allow public read access
create policy "Public can view rotators"
  on rotators for select
  using ( true );

-- Allow authenticated users to insert their own rotators
create policy "Users can insert their own rotators"
  on rotators for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Allow users to update their own rotators
create policy "Users can update their own rotators"
  on rotators for update
  to authenticated
  using ( auth.uid() = user_id );

-- Allow users to delete their own rotators
create policy "Users can delete their own rotators"
  on rotators for delete
  to authenticated
  using ( auth.uid() = user_id );
