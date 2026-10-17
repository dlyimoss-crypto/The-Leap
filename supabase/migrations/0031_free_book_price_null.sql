-- A book saved with a price of "0" got price_cents = 0 instead of null.
-- Everything that decides "is this book free" — the reader page, the
-- manuscript access check and the "readers open published free manuscripts"
-- storage policy (0021) — only treats null as free, so a $0 book showed
-- "Purchasing isn't live yet" and its manuscript couldn't be opened.
-- The forms now save zero as null; convert existing rows and stop 0 from
-- being stored again so free has exactly one representation.
update books set price_cents = null where price_cents <= 0;

alter table books
  add constraint books_price_cents_positive
  check (price_cents is null or price_cents > 0);
