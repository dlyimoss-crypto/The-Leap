Type: task
Status: resolved

## Question

Commit's contents: what screens/features live under the Commit tab? Left as fog in the original nav-restructure round (ticket 10) — the tab shipped as a bare "Coming soon" placeholder.

## Answer

Built the `Commitment` concept from CONTEXT.md — a user-authored, self-tracked weekly intention — as the entirety of the Commit tab for now:

- One active commitment at a time per user (same "one thing at a time" posture as a Formation Journey), backed by the `commitments` table that already existed in the schema (ticket 02) but had no UI.
- `/commit`: shows the active commitment with a "Mark as kept" action, or a short form to set one if none is active; a history list of kept commitments underneath.
- Home surfaces the active commitment (or a prompt to set one) as its own card, per CONTEXT.md's "shown on Home and My Journey" line.

No day-by-day check-in granularity — kept to the existing `active`/`completed` + `week_of` shape rather than adding a new table for finer tracking. Can be revisited if daily granularity turns out to matter.
