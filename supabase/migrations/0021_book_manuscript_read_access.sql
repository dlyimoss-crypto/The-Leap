-- Readers could see a published free book in the Library, but opening it
-- did nothing: the "book-manuscripts" bucket only granted read access to
-- the author or an admin (0012_book_storage.sql), so a signed URL request
-- for anyone else's manuscript came back empty. Extend read access to the
-- manuscript file of any published, free (price_cents is null) book so a
-- signed URL can actually be generated for readers.
--
-- Paid books stay locked down here — there's no purchase/entitlement table
-- yet, so granting read access to a paid manuscript would let anyone read
-- it for free. That gate can be loosened once purchases exist.
create policy "readers open published free manuscripts" on storage.objects
  for select using (
    bucket_id = 'book-manuscripts'
    and exists (
      select 1 from public.books b
      where b.manuscript_path = storage.objects.name
        and b.status = 'published'
        and b.price_cents is null
    )
  );
