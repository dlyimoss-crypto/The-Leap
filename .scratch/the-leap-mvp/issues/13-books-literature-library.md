Type: grilling
Status: resolved
Blocked by: 10

## Question

The map's "Out of scope" section explicitly deferred "books/literature library" per the white paper's own MVP Scope Philosophy (§30), with its own rule that deferred features "return only as fresh effort maps once V1 ships, not as a resumption of this one." The user has now asked for it back in, as a top-level nav item alongside Daily Devotion and Scripture, ahead of V1 shipping — this ticket is that reopening, tracked explicitly rather than silently reversed.

Reviving it raises the same category of questions ticket 03 answered for Scripture text, plus product-scope ones the white paper doesn't cover at all here:

- **Content sourcing/licensing**: is this Leap-authored material (devotional books, formation-domain deep-dives), licensed third-party Christian literature, or public-domain classics (Foxe, à Kempis, Bonhoeffer-adjacent-but-out-of-copyright, etc.)? Each has a completely different cost/rights profile, same axis ticket 03 worked through for Bible text.
- **Format**: read-in-app text/EPUB, PDF downloads, or just an external-link curated list? This determines almost all the engineering scope.
- **Relationship to Formation Domains**: is the library organized by the ten Formation Domains (CONTEXT.md), searchable/flat, or something else?
- **V1 sizing**: does this launch with real content, or as a placeholder/"coming soon" tab so the nav slot exists without content-acquisition work blocking the rest of the restructure?
- Is this in tension with CONTEXT.md's explicit framing that the product's job is "not to be a content library"? Worth a deliberate answer, since it's the one part of this request that most directly revisits a decision already made twice (white paper §30 and this map's own "Out of scope" section).

## Answer

**Placement only, resolved**: Books & Literature is the fourth peer card in the Evolve Hub (ticket 10), alongside Journeys, Scripture, and Daily Devotion — it's growth/formation content, the same category as those three. This is the "reopening" itself: the deferral in this map's "Out of scope" section is now explicitly struck through with a pointer here, rather than silently reversed.

**Deliberately not resolved here**: content sourcing/licensing, format (in-app reader vs. PDF vs. curated external links), relationship to the ten Formation Domains, V1 content sizing, and the tension with CONTEXT.md's "not... a content library" framing. This round only locked the information-architecture slot the feature occupies — "we don't need to design the entire Books experience yet, but its IA position can be locked." Those remaining questions carry forward to [ticket 15](./15-books-library-content-scope.md).

