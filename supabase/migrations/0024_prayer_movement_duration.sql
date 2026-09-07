-- A prayer movement now runs for a set number of days, chosen by the admin
-- at activation. `active_until` is nullable so already-active rows (created
-- before this column existed) keep showing indefinitely until an admin
-- re-activates them with an explicit duration — only newly-activated rows
-- ever get a real expiry.
alter table prayer_movements add column active_until date;
