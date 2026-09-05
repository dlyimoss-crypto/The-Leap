insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "users manage own avatar files" on storage.objects
  for all using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "anyone reads avatar files" on storage.objects
  for select using (bucket_id = 'avatars');
