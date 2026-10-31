-- Generalises the prayer movement into an Announcement: the single featured
-- window on Home that can carry a prayer movement, news, an event, an advert
-- or a general message. Still one active at a time, same table (renaming
-- would break the running app mid-deploy) — every existing row becomes a
-- 'prayer' announcement and keeps working unchanged.
--
-- Additive only: safe to apply before the code that uses it is deployed.

alter table prayer_movements
  add column kind text not null default 'prayer'
    check (kind in ('prayer', 'news', 'event', 'advert', 'general')),
  add column body text,
  add column image_path text,
  add column link_url text,
  add column link_label text,
  add column event_date date;

-- Announcement images: public to read (shown to every user), admin-only to
-- write.
insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do nothing;

create policy "admin manages announcement images" on storage.objects
  for all using (bucket_id = 'announcement-images' and is_admin())
  with check (bucket_id = 'announcement-images' and is_admin());
create policy "anyone reads announcement images" on storage.objects
  for select using (bucket_id = 'announcement-images');
