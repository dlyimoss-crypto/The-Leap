-- The Scripture interface now reads the Berean Standard Bible instead of the
-- World English Bible. Existing bookmarks point at references that the BSB
-- covers too, so move them across rather than leaving them labelled WEB.
update scripture_bookmarks set translation = 'BSB' where translation = 'WEB';

alter table scripture_bookmarks alter column translation set default 'BSB';
