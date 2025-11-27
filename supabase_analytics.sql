-- Create analytics table
create table analytics (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references cards(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  referrer text
);

-- Enable RLS
alter table analytics enable row level security;

-- Create policies
create policy "Public can insert analytics"
  on analytics for insert
  with check (true);

create policy "Public can view analytics"
  on analytics for select
  using (true);
