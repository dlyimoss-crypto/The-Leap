-- A journey's purpose can run to several sentences — right for its own
-- overview page, too much for the short teaser line shown on Home's
-- dashboard cards. Optional: falls back to purpose when left blank.
alter table journeys add column teaser text;
