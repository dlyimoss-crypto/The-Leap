Type: grilling
Status: resolved
Blocked by: 13

## Question

Ticket 13 locked Books & Literature's information-architecture placement (a peer card in the Evolve Hub) without designing the feature itself. What's carried forward, unresolved:

- **Content sourcing/licensing**: Leap-authored material, licensed third-party Christian literature, or public-domain classics (Foxe, à Kempis, and similar out-of-copyright works)? Each has a completely different cost/rights profile — the same axis ticket 03 worked through for Bible text, and worth the same kind of research pass rather than a guess.
- **Format**: read-in-app text/EPUB, PDF downloads, or a curated list of external links? This determines almost all of the engineering scope, from "content-as-code directory" (cheap, matches ticket 02's pattern) to "build or license a reader" (expensive).
- **Relationship to Formation Domains**: organized by the ten Formation Domains (CONTEXT.md), flat and searchable, or something else?
- **V1 sizing**: does this launch with real content, or as a placeholder/"coming soon" card in the Evolve Hub so the IA slot exists without content-acquisition work blocking the rest of the nav restructure?
- Ticket 13 flagged, without resolving, the tension with CONTEXT.md's explicit framing that the product's job is "not to be a content library." Worth a deliberate answer before content work starts, not an implicit one.

## Answer

Wrong-shaped question, superseded rather than answered in place. Grilling turned up that the real ask isn't "which content do we curate" — the user is an author who wants to publish their own books *and* open publishing to other authors who join The Leap, mixing free and premium (paid) content, and their team wants to write and publish new Daily Devotion content daily rather than deriving it from the Formation Journey (reopening ticket 11 too). That's a multi-author publishing platform with monetization, review workflow, and new roles — a different kind of feature than this ticket was scoped to ask about, and one that collides with the map's own "no monetization/payments in V1" and "editorial/theological advisory board is out of scope" decisions.

Spun into its own effort: [`.scratch/author-publishing/map.md`](../../author-publishing/map.md). This ticket's placement answer stands (Books & Literature is the fourth Evolve Hub card) — everything about what actually populates it now belongs to that effort.
