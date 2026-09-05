insert into storage.buckets (id, name, public)
values ('book-manuscripts', 'book-manuscripts', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "authors manage own manuscript files" on storage.objects
  for all using (
    bucket_id = 'book-manuscripts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "admin reads all manuscript files" on storage.objects
  for select using (bucket_id = 'book-manuscripts' and is_admin());

create policy "authors manage own cover files" on storage.objects
  for all using (
    bucket_id = 'book-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "anyone reads cover files" on storage.objects
  for select using (bucket_id = 'book-covers');
