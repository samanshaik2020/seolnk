-- Create a storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Set up access policies for the storage bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Anyone can upload"
  on storage.objects for insert
  with check ( bucket_id = 'images' );
