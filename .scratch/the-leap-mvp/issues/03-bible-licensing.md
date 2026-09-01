Type: research
Status: resolved

## Question

What's the best way to get licensed Bible text into a web app for V1 — which API/provider, which translation(s), what the licensing terms and costs actually are, and any usage restrictions (rate limits, attribution requirements, redistribution limits) that would constrain how Scripture is displayed or cached in the product?

## Answer

Full comparison: [research/bible-licensing.md](../research/bible-licensing.md)

Launch on **self-hosted public-domain text** (WEB as the primary modern-English translation, KJV/ASV as alternates), seeded once from an open dataset (`getbible.net` or `wldeh/bible-api`) into the app's own database. Zero cost, zero licensing approval, no rate limits, no uptime dependency on a third party — a good fit for a devotional feature showing a few verses at a time.

Add **API.Bible's Express Licensing** (self-serve, ~$10+/month per translation, scales with active users) once there's revenue, to reach NIV-adjacent/NLT/CSB-class translations. Avoid the ESV API and NLT.to API as a foundation — both explicitly forbid commercial/monetized use without a separate written permission letter. YouVersion's new Platform API is broad but **non-commercial only today** (no ads/paywalls/subscriptions permitted), so it's out until Leap+ exists or their terms change.

Build a `BibleProvider` interface from day one so the text source is swappable without touching devotional/UI logic — this is now a fact ticket 01 (tech stack) and ticket 02 (data model) should design around.
