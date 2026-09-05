Type: grilling
Status: resolved
Blocked by: 01

## Question

Ticket 01 decided Devotion is a separate, always-free, admin-authored system distinct from Books. Four things needed settling: whether it reuses the existing Admin role, what fields a devotion actually has, whether there's an archive, and how scheduling/publishing works.

## Answer

**Reuses the existing Admin role.** A new "Devotions" tab is added to `/admin`, alongside the existing Moderation Queue and Users tabs (ticket 06) — same account, same `profiles.role === "admin"` gate. No separate "Author" role for V1; revisit only if a second person needs to write devotions without also moderating content.

**Content model — deliberately minimal, distinct from a Formation Session**:
- **Title** (required)
- **Scripture Reference** (optional)
- **Body** (required)

That's it — no forcing every piece of content through the Formation Loop's six-step structure. A Formation Session is a structured, interactive, multi-step formation experience; a Daily Devotion is a short, reflective, editorial spiritual reading. Keeping them visually and structurally distinct is itself a decision worth preserving.

**Archive, not "today only."** Published devotions are never deleted for no longer being today's — they accumulate into a growing archive. `/evolve/devotion` shows Today's entry front and center, with a "Past Devotions" list (date + title, most recent first) beneath it.

**Scheduling from V1.** Data model:

```
Devotion
├── id
├── title
├── scripture_reference (nullable)
├── body
├── status            -- draft | scheduled | published
├── publish_date
├── created_at
├── updated_at
└── author_id
```

No separate "archived" status — a published devotion that's no longer today's stays `published`, it's just not the one matching today's date. Public-facing logic is simply "the published devotion whose `publish_date` is the latest one `<=` today." Writing several days ahead (e.g. Sunday writing Monday–Friday) means each one automatically goes live on its own date with no daily manual "Publish" action required.

**Admin dashboard** groups by status at a glance — Drafts (n), Scheduled (n), Published (n) — with a single "+ New Devotion" primary action. The Draft/Scheduled/Published distinction should be visually obvious in that list, not just a filter.
