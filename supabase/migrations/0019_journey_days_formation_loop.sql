-- Narrows the Formation Loop for Journey Sessions to
-- Scripture -> Message -> Explore -> Reflect -> Pray (see docs/adr/0001).
-- Practice and Connect are dropped as Session fields; Practice survives
-- as its own, unrelated field on the `devotions` table.

alter table journey_days add column message text not null default '';
alter table journey_days alter column message drop default;

alter table journey_days drop column practice;
alter table journey_days drop column connect;
