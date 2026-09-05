Type: grilling
Status: resolved
Blocked by: 10

## Question

Ticket 03 sized Bible-text licensing/hosting for "a devotional feature showing a few verses at a time" — and that's exactly what's built: `src/lib/content/scripture.ts` reads a curated JSON keyed by reference (`content/bible/web/faith-in-christ.json`), containing only the specific passages the "Faith in Christ" journey cites. There's no book/chapter browser, no full-Bible dataset loaded, and no search.

A standalone top-level "Scripture" nav item implies something bigger than that, so this needs scoping before it's a task:

- Is "Scripture" a full Bible reader (browse any book/chapter, jump to a reference, search) independent of any journey, or a narrower surface — e.g. today's journey passage plus past passages the user has already encountered, without general browse/search?
- If it's a full reader: that means ingesting the complete WEB (and KJV/ASV alternate) translation text, not just the per-journey excerpt file — a real `BibleProvider` with browse/search, not the current reference-lookup-only implementation. Worth confirming that's an intentional scope jump, not an assumption.
- CONTEXT.md's product framing is explicit that The Leap is "not... a Bible app." A full Scripture browser/search tab is the single feature most likely to blur that line — worth a deliberate call, not a default.
- Does Scripture reader content stay English-only per ticket 07 (language launch scope), or does opening it as a standalone destination change that calculus?

## Answer

**Scripture is a full reader** — "Read, search, study and save God's Word" is the Evolve Hub card's own description (ticket 10). This is a deliberate scope jump past ticket 03's "a devotional feature showing a few verses at a time" sizing and past the current implementation (`src/lib/content/scripture.ts`, which only looks up the curated per-journey excerpt file). It confirms the bigger build: ingesting the complete WEB translation text (plus KJV/ASV alternates) and a real `BibleProvider` with browse/search/save, not just reference lookup.

**Translations for V1**: WEB primary, KJV and ASV alternates — ticket 03's existing plan, unchanged. ESV, NIV, and NKJV are all deferred (NKJV confirmed, via research this round, to require the same written-commercial-permission path as ESV — Thomas Nelson/HarperCollins Christian Publishing copyright, not public domain like KJV). None of that licensing pursuit sits on the V1 critical path.

**Build the translation picker as a genuinely extensible list from day one** — `Translation: WEB | KJV | ASV` today, with NIV/NKJV/ESV as later additions to the same list — rather than hard-coding today's three translations through the Scripture interface. Adding a translation later should be a config/licensing addition, not a UI rewrite.

**Stays English-only**, per ticket 07 — nothing in this round changed that.

**Flagged, not resolved**: choosing a full read/search/study/save Scripture destination sits closer to "a Bible app" than CONTEXT.md's explicit framing ("not... a Bible app") anticipated. Worth building deliberately so Scripture here still serves formation — surfaced from and tied back to the Journey/Session flow, save/search framed around a person's own formation journey — rather than becoming a general-purpose Bible-app destination in its own right. Not re-opening the ticket over this, just making sure it's a seen tradeoff, not a silent one.

## Comments

Implemented as a **shell**, not the full reader this ticket describes — a deliberate scope call made at implementation time: `/evolve/scripture` ships on today's existing 24-verse curated dataset (not full WEB/KJV/ASV ingestion), with search/save/favorites working against that curated set, and the translation picker built extensibly (WEB active, KJV/ASV shown as "Coming soon") so the real full-reader build doesn't require a UI rewrite later. Full ingestion and a real `BibleProvider` remain a distinct, not-yet-scheduled follow-up — this ticket's "full reader" answer is the target, not what's live today. Verified live: search, save/unsave, and favorites all work correctly against the curated set; a rendering bug (double-wrapping already-quoted verse text) was found and fixed during QA.

