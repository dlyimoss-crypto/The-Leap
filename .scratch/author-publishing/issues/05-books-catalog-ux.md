Type: grilling
Status: resolved
Blocked by: 02, 04

## Question

Tickets 01/02/04 settled the submission/review/pricing mechanics behind Books & Literature, but not what a user actually sees when they open it from the Evolve Hub. What's the catalog/browse experience — structure, filtering, the book detail/purchase moment, and whether authors get their own presence?

## Answer

**Catalog structure — filtered, not flat.** A lightweight filter row over the category/tag data already collected at submission (ticket 02) — e.g. All / Devotion / Discipleship / Leadership / Family / Prayer / Christian Living. Categories/tags are stored as data, not hard-coded into the UI, so the taxonomy can grow into CONTEXT.md's full ten Formation Domains later once the catalog is large enough to justify that structure — V1 just needs simple filtering. Each card shows cover, title, author, category/tag, and Free/price.

**Free and Premium — one mixed library, not split tabs.** A hard Free/Premium split reads as a storefront; one library where every card honestly shows its own access status (a "Free" badge or the price) keeps the framing as a resource ecosystem. An All/Free/Paid filter can be added later if the catalog gets large enough to want it.

**Book detail screen — locked**: cover, title, "by [Author Name]" (linking to the author page), description, category tags, and an access line — either **Free** with a "Get Book" button, or a **price** with a "Buy Book — $X.XX" button.

**Checkout — direction locked, processor explicitly still open.** The preferred experience is an embedded/hosted checkout that still feels connected to the app (not a jarring full external redirect). This is deliberately split into two separate decisions so implementation doesn't silently assume a processor before the research happens:
- Book detail UX — **Locked**
- Checkout UX direction (in-app-feeling, embedded/hosted) — **Locked**
- Specific payment processor — **Open**, carried in the map's Fog

**Author pages — yes, simple.** Tapping an author's name goes to an author profile: photo, short bio, and a list of their published books. That's the whole V1 scope — explicitly **not** building followers, author ratings, dashboards, social feeds, reviews, or analytics. The page answers exactly one question: who wrote this, and what else have they written?

**Search — deferred, but the data model stays search-ready.** No search box for V1; category filters plus scrolling cover a catalog that starts small. Title, author name, description, tags, and categories should still be clean, individually queryable fields in the data model (not, say, a single freeform blob) so search is a query addition later, not a schema change.

**Naming**: keep "Books & Literature" as the section's full name consistently (not shortened to "Books") — it deliberately leaves room for study guides, devotional collections, articles, teaching resources, and ministry literature to join the same section later without a rename.

## Full flow (author side + reader side)

```
ADMIN                                    EVOLVE
  │                                        └── BOOKS & LITERATURE
  ├── Approve Author                              │
  ▼                                          ┌─────┴─────┐
AUTHOR                                    All      Categories/Tags
  ├── Create Book                                │
  ├── Upload PDF/EPUB                            ▼
  ├── Add Cover                             BOOK CATALOG (mixed Free/Paid)
  ├── Add Description                             │
  ├── Add Categories/Tags                         ▼
  ├── Rights Attestation                     BOOK DETAIL
  ▼                                          ┌─────┴─────┐
SUBMIT                                   AUTHOR       GET / BUY
  ▼                                       PAGE              │
ADMIN REVIEW                                                ▼
  ├── Request Changes                                  CHECKOUT
  ├── Reject                                                │
  └── Approve → PUBLISHED                                   ▼
                                                        ENTITLEMENT
                                                              │
                                                              ▼
                                                         DOWNLOAD
```
