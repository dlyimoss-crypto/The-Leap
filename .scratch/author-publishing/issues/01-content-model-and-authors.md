Type: grilling
Status: resolved

## Question

Two things need settling before any of the map's other fog (payments, review workflow, format) can be charted:

1. **One system or two?** Books & Literature (paid, potentially multi-author, discrete works) and Daily Devotion (free, ongoing, dated content the founder's team writes) may be the same underlying content-publishing model — authors, submissions, a `premium` flag, a publish date — or two genuinely separate features that happen to share an author.
2. **Who is "an author" for V1?** Just the founder initially, with the multi-author part deferred, or self-serve signup for other authors from day one?

## Answer

**Two separate systems** (not one shared content-publishing model): Devotion is core, always-free, admin-authored daily content; Books & Literature is a discrete-purchase, multi-author marketplace. Content architecture is now understood as three first-class pillars, not one generic "post" type with flags:

```
CONTENT
├── Devotions        (title, scripture ref, body, publish date, author)
├── Books            (title, description, author, files, categories, price)
└── Formation Content (Sessions / Journeys — pre-existing, unchanged)
```

**Authorship model, revised from this ticket's original question**: Books & Literature supports multiple authors/contributors **from V1**, not founder-only — but publication is gated exclusively behind Admin review. **Author ≠ Publisher**: an author creates and submits; only Admin approval makes a book publicly visible. No book reaches the app until Admin has reviewed it. This is deliberately built to scale to pastor/teacher books, other Christian authors, devotional books, Bible-study resources, leadership books, discipleship materials, partner-ministry content, and curated external recommendations — without a later rebuild of the publishing architecture.

The detailed submission/review workflow (author-side fields, admin-side actions, status flow) is its own ticket: [02 — Books submission & review workflow](./02-books-submission-workflow.md). Devotion's content model and admin authoring workflow is [03 — Daily Devotion content model](./03-devotion-content-model.md).

## Context for the map

Both child tickets (02, 03) are resolved alongside this one — see `../map.md` Decisions so far.
