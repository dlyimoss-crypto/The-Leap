# Licensed Bible Text for The Leap — Options Research (Sept 2026)

## TL;DR Recommendation

**Start with a self-hosted, public-domain text set (WEB, KJV, ASV) served from your own Supabase/Postgres tables** — either seeded from `wldeh/bible-api`'s open dataset or `getbible.net`'s v2 JSON — with **API.Bible's free Starter plan** as a secondary/backup source for the same public-domain translations plus easy access to a couple of open-access modern-English options (e.g. BSB, if listed as Open Access). This gets a working devotional feature live today with **zero licensing paperwork, zero cost, and no commercial-use gate**, since KJV/ASV/WEB are public domain and self-hosting removes any third-party rate limit or uptime dependency.

Then, once The Leap has real usage/revenue, apply to **API.Bible's Express Licensing** (Pro plan, ~$10+/month per copyrighted translation, priced further by monthly active users) to unlock NIV-adjacent/NLT/CSB-class translations, or apply separately to the **YouVersion Platform** for NIV/ESV-class access via its Fast-Track Licensing — but treat YouVersion as **non-commercial only today** (their terms currently prohibit ads/paywalls/subscriptions in apps using their content), so it's not viable once The Leap monetizes unless their terms change or you get an explicit commercial exception.

Avoid ESV API and NLT.to API as primary sources for a commercial product — both are explicitly non-commercial-use APIs that require a separate written license/permission letter from Crossway or Tyndale before any monetized use, which is exactly the friction a solo founder wants to defer. Treat Bolls.life, Bible SuperSearch, and getBible as convenient prototyping/dev sources, not as your production licensing foundation, because none of them give you a clean commercial license per translation — you inherit the underlying copyright risk yourself.

**Practical MVP path:** build a `BibleProvider` abstraction (interface) in the app from day one so the text source is swappable without touching UI/devotional logic. Launch on self-hosted public-domain text (WEB is in modern English and reads better for devotionals than KJV; ASV/KJV as alternates). Add API.Bible as a live-fetch fallback/expansion path. Revisit YouVersion and API.Bible Express Licensing for NIV/ESV/NLT-class translations once there's a monetization model and budget.

---

## 1. Comparison Table

| Provider | Translations (PD-adjacent) | Translations (popular modern) | Access model | Cost | Rate limits | Caching/redistribution restrictions |
|---|---|---|---|---|---|---|
| **API.Bible** (American Bible Society) | KJV, ASV, WEB, and other public-domain/CC texts, free on all plans | NIV (commercial licensing unavailable per Express Licensing), NLT, NKJV, NASB, CSB, The Message, GNT, Amplified, etc. — commercially licensable per-translation via Express Licensing | Self-serve signup + API key; commercial use requires toggling "Digital Licensing Use = Yes" at checkout and agreeing to the license per Bible; some translations need direct publisher approval (Unique License) | Free Starter plan: 5,000 queries/day, 500 consecutive verses/query, up to 3 licensed (copyrighted) Bibles included for non-commercial use, all Open Access (PD/CC) Bibles free. Pro plan required for commercial use; copyrighted translations from ~$10/month each, scaled further by estimated monthly active users; overage ~$1 per 1,000 extra calls | 5,000 queries/day (Starter); higher on paid plans (not fully published, contact sales) | Must re-check cached content every 30 days and remove/update within 24 hrs of a change notice; may not sublicense/redistribute API content to third parties without permission; must cap printed/displayed output around 100 verses per session per the standard terms; visible attribution + hyperlink to api.bible required (Starter); copyright page identifying translation/IP holder required; usage tracked via "FUMS" (Fair Use Management System) |
| **YouVersion Platform (Bible.com)** | KJV, ASV, WEB and other PD texts included among ~1,475 versions/1,244 languages | NIV, ESV, NLT, NASB, CSB and most major modern translations, via YouVersion's existing publisher partnerships and "Fast-Track Licensing" | Register developer account + app at platform.youversion.com to get an App Key (`X-YVP-App-Key` header); REST API + SDKs (Swift, Kotlin, JS/TS, React, React Native/Expo); opened to public developers ~April 2026 | Free — "no cost to integrate" | Not publicly documented in detail; practical reports (dev.to writeup) note the `/bibles` list endpoint only shows versions enabled for your app key unless `all_available=true` is passed | **Non-commercial use only as of current terms**: apps using YouVersion content may not run ads, paywalls, or subscriptions — YouVersion explicitly promises an "ad-free" scripture experience to end users. This is the single biggest limitation for a monetized app. Format defaults to HTML (use `format=text` param). No published verse-count cap found, but redistribution/sublicensing outside the approved app is not permitted |
| **ESV API (Crossway)** | — (ESV itself is copyrighted, not PD) | ESV only | Self-serve API key for personal/non-commercial sites; commercial or higher-volume use requires a written permissions request via crossway.org/permissions | Free for non-commercial; commercial pricing not published — negotiated case-by-case via permissions form | 5,000 queries/day; 1,000 requests/hour; 60 requests/minute | Max 500 consecutive verses or half a book per query/page (whichever is smaller); explicitly "personal and non-commercial use only" — may not "modify, distribute, reproduce, publish, license, create derivative works from, transfer, or sell" content from the site; commercial/monetized apps are out of scope of the standard terms entirely |
| **NLT API (Tyndale / api.nlt.to)** | — | NLT only | Free signup for non-commercial embedding; commercial/monetized or NLT-heavy sites require a Permission Letter or License from Tyndale House | Free non-commercial; commercial fee negotiated directly with Tyndale | Not publicly detailed | Up to 500 verses may be quoted without written permission in print/ebook context, provided quoted verses are <25% of the total work and no complete Bible book is quoted; if content is "substantially or exclusively" NLT and monetized, a fee + permission letter is required |
| **Bible Gateway** | N/A | N/A | No general-purpose public developer API exists in 2026 (a limited legacy SOAP "Verse of the Day" service reportedly exists); developers rely on unofficial/community scraping wrappers on GitHub, which is fragile and not a licensing path | N/A | N/A | Not a real option for The Leap — no first-party licensing program for third-party apps |
| **Digital Bible Platform / Bible Brain (Faith Comes By Hearing)** | Extensive PD text coverage among 2,695 languages | Some modern translations depending on partner agreements; primarily known for **audio/video** dramatized scripture (their core differentiator) plus text | Apply for API access/partnership with Faith Comes By Hearing; well-documented with Postman collections | Free for approved partner developers | Not fully published | Designed for partner apps (powers Bible.is, YouVersion-adjacent products, Subsplash, SIL Scripture App Builder); licensing terms are partner-agreement-based rather than self-serve checkout — best fit if audio/video Scripture becomes a Leap feature later, less ideal as the primary *text* source given the extra approval step |
| **Bolls.life** | KJV, ASV, WEB, Young's Literal, and 140+ other translations | Several modern translations mirrored, but licensing status is largely undocumented | No API key or signup required; open REST endpoints | Free, no published pricing | Not documented | No terms of service, no license page, no per-translation attribution/restriction notices published — "technical availability is not a content license." You inherit full risk of verifying whether a given non-PD translation is properly licensed for redistribution. Fine for prototyping/dev, risky as sole source for a commercial translation |
| **Bible SuperSearch** | Multiple PD versions bundled with the open-source engine | Some, depending on install | Self-host the open-source (GPLv3) PHP/MySQL engine, or use the hosted API | Hosted API free but capped at 1,000 hits/day for non-commercial use; self-hosted install has no request cap but is licensed **non-commercial only** — commercial use requires separate written permission | 1,000 hits/day (hosted, non-commercial) | GPLv3 covers the software; bundled Bible texts carry independent licenses per version (mix of PD, non-commercial-license, and publisher-licensed); explicitly **not licensed for commercial use** without prior written permission |
| **getBible (getbible.net v2)** | AKJV, KJV, ASV, WEB, and other public-domain/CC texts across many languages | Limited — catalog skews toward PD/open-licensed texts rather than major modern commercial translations | No API key required; `translations.json` lists every version with declared license | Free | Not documented, presumably generous/unthrottled given no-key model | Per-translation license is declared in metadata (mostly Public Domain); good clean provenance for a self-hosted PD dataset, but doesn't help you reach NIV/ESV/NLT-class translations |
| **bible-api.com (wldeh/bible-api, Tim Morgan project family)** | KJV, ASV, WEB (default), Darby, YLT, plus non-English PD texts | Not a source for major modern copyrighted translations | No key; MIT-licensed wrapper code, served via jsDelivr CDN or Tim Morgan's hosted instance | Free | 15 requests / 30 seconds per IP (hosted instance); no limit if self-hosted from the GitHub data | Explicitly says "do not use this API to download an entire bible" against the hosted instance — grab the underlying data from GitHub and self-host instead for production reliability. Individual version metadata should be checked, but the advertised catalog is PD/open-licensed |

## 2. Notes per provider

### API.Bible (American Bible Society) — `api.bible` / `docs.api.bible`
- Two Bible categories: **Open Access** (public domain or Creative Commons — free on every plan, no commercial restriction) and **Copyright-Protected** (Standard License or Unique/publisher-specific License).
- Commercial-use definition is broad: any ads, freemium, subscriptions, sponsorships, or paid access counts as commercial — so a devotional app with even a future subscription tier needs the commercial agreement, not just the free non-commercial one.
- Express Licensing is largely self-serve (toggle a switch, agree to per-Bible terms, pay via checkout) rather than a slow manual-approval process — a meaningfully lower-friction path than YouVersion or Crossway for scaling into paid translations later.
- NIV is specifically called out as **not available** under Express Licensing for commercial use (Biblica requires separate direct negotiation).
- Sources: [Plans & Pricing](https://docs.api.bible/your-account/plans-pricing/), [Express Licensing for Commercial Use](https://care.api.bible/article/409-express-licensing-for-commercial-use), [Understanding API.Bible Licensing](https://care.api.bible/article/369-understanding-api-bible-licensing), [Terms & Conditions](https://api.bible/terms-and-conditions).

### YouVersion Platform — `platform.youversion.com` / `developers.youversion.com`
- Opened its public developer platform in **April 2026** — this is genuinely new, so terms/tooling may still shift.
- Biggest catch for The Leap: current terms appear to require the *end product* stay non-commercial (no ads, no paywall, no subscription) wherever YouVersion content is used, because YouVersion promises users scripture stays ad-free. That is a hard blocker the moment The Leap introduces a paid tier around devotional content, unless a separate commercial agreement is negotiated.
- Real-world integration notes (from a developer's public writeup) flag: required `language_ranges[]` param, translation list endpoint only shows what's enabled for your app key (pass `all_available=true` for the full catalog), HTML-wrapped text by default (use `format=text`), and no way to request a custom "verse of the day" (their curated endpoint only).
- Sources: [YouVersion Platform](https://platform.youversion.com/), [Platform Terms of Use](https://platform.youversion.com/terms), [API usage docs](https://developers.youversion.com/api-usage), [dev.to integration writeup](https://dev.to/arvavit/4-footguns-integrating-youversions-new-platform-api-and-a-clean-verse-of-the-day-2087).

### ESV API (Crossway) — `api.esv.org`
- Straightforward, well-documented rate limits (5,000/day, 1,000/hr, 60/min) and a clear verse cap (500 verses or half a book per query/page).
- Explicitly restricted to **personal and non-commercial use**; the terms flatly prohibit redistribution, republishing, or selling ESV content obtained via the API. Any commercial/monetized use requires a separate written license via [crossway.org/permissions](https://www.crossway.org/permissions/) — process and cost not published, case-by-case.
- Good option later for a "premium translation" behind a licensed agreement, not a good default for an MVP that isn't sure yet if/how it will monetize.

### NLT API (Tyndale) — `api.nlt.to`
- Same shape as ESV: fine for free non-commercial embedding, but a monetized or NLT-heavy product needs a Permission Letter/License directly from Tyndale House. The classic "quote up to 500 verses / <25% of the work" print permission doesn't cleanly cover an API-driven app experience.

### Bible Gateway
- No meaningful first-party public API for third-party commercial products exists as of 2026; what's out there (a legacy SOAP verse-of-the-day feed, unofficial scraping wrappers on GitHub) is not a licensing path and shouldn't be relied on for production.

### Digital Bible Platform / Bible Brain (Faith Comes By Hearing)
- Strongest where audio/video dramatized Scripture matters (Bible.is, Subsplash, SIL's Scripture App Builder all run on it) — less differentiated as a pure-text source, and access is via partner application rather than instant self-serve signup. Worth revisiting if The Leap adds audio scripture readings.

### Bolls.life, Bible SuperSearch, getBible, bible-api.com/wldeh
- All are useful, low-friction developer tools for prototyping and for serving genuinely public-domain text (KJV/ASV/WEB), but none of them hands you a clean, documented commercial license for copyrighted modern translations. Bolls in particular has essentially no published terms at all — treat anything beyond PD/CC text from these sources as "unverified provenance," not something to lean on for the parts of the product tied to revenue.
- Best practical use: seed a self-hosted Postgres table (in Supabase) with WEB/KJV/ASV text from getBible's `translations.json` or wldeh/bible-api's GitHub data, so The Leap's devotional feature has zero runtime dependency on any third-party API's uptime or rate limit, and zero licensing exposure since the text is public domain.

## 3. Recommendation detail for The Leap's MVP

**Why self-hosted public domain first:**
- The Leap's devotional use case (a few verses to a short paragraph, once or twice a day) doesn't need the "premium" feel of NIV/ESV to be spiritually effective — WEB is a modern-English public-domain translation with no copyright encumbrance at all, ASV/KJV are viable stylistic alternates.
- Zero legal review needed, zero recurring cost, no rate limit or API outage risk since it's your own database.
- Fully compatible with a Next.js + Supabase stack: import once into a `verses` table, query with normal SQL/Row Level Security, no external fetches on the hot path.

**Why API.Bible as the near-term paid upgrade path rather than YouVersion or Crossway/Tyndale directly:**
- Self-serve checkout-based licensing (turn on "commercial use," agree per-Bible, pay) is dramatically lower friction for a solo founder than Crossway's/Tyndale's manual written-permission process, and lower risk than relying on YouVersion while its non-commercial-only terms remain in force.
- Per-translation pricing (~$10/month baseline, scaling with users) is transparent enough to budget for once The Leap has paying users or ad revenue, versus ESV/NLT's undisclosed case-by-case commercial pricing.

**When to revisit YouVersion:** if YouVersion's platform terms evolve to allow monetized apps (worth periodically re-checking given how new the April 2026 platform is), it's attractive for its breadth (1,475 versions) and its recognizable brand with users. Until then, treat it as a non-commercial/free-tier-only option.

**Architecture note:** implement a small `BibleProvider` interface (`getPassage(reference, translationId)`) in the codebase from the start, backed initially by the Supabase-hosted PD text table, with an adapter for API.Bible added later. This avoids having translation-source lock-in baked into devotional-content UI or Supabase schema decisions made early in the MVP.

## Sources

- [API.Bible — Plans & Pricing](https://docs.api.bible/your-account/plans-pricing/)
- [API.Bible — Express Licensing for Commercial Use](https://care.api.bible/article/409-express-licensing-for-commercial-use)
- [API.Bible — Understanding API.Bible Licensing](https://care.api.bible/article/369-understanding-api-bible-licensing)
- [API.Bible — Terms & Conditions](https://api.bible/terms-and-conditions)
- [API.Bible — FAQs](https://docs.api.bible/common-questions/)
- [ESV API](https://api.esv.org/)
- [ESV.org — Terms of Service](https://www.esv.org/about/terms/)
- [Crossway — Permissions Requests](https://www.crossway.org/permissions/)
- [YouVersion Platform](https://platform.youversion.com/)
- [YouVersion Platform — Terms of Use](https://platform.youversion.com/terms)
- [YouVersion Platform — API usage docs](https://developers.youversion.com/api-usage)
- [4 footguns integrating YouVersion's new platform API (dev.to)](https://dev.to/arvavit/4-footguns-integrating-youversions-new-platform-api-and-a-clean-verse-of-the-day-2087)
- [NLT.TO API](https://api.nlt.to/)
- [Tyndale Permissions](https://www.tyndale.com/permissions)
- [Faith Comes By Hearing / Bible Brain announcement](https://www.prnewswire.com/news-releases/faith-comes-by-hearing-announces-api-access-to-digital-bible-platform-for-partnering-developers-201977951.html)
- [Bible Brain API overview (faith.tools)](https://faith.tools/app/153-bible-brain-api)
- [Bolls Bible API review 2026 (learnofchrist.com)](https://learnofchrist.com/resources/bolls-bible-api)
- [Bible SuperSearch — Software Licenses](https://www.biblesupersearch.com/license/)
- [Bible SuperSearch API](https://www.biblesupersearch.com/api/)
- [getBible v2 — translations.json](https://github.com/getbible/v2/blob/master/translations.json)
- [Get.Bible — Bible APIs and Digital Scripture Data Sets](https://get.bible/bible-data-sets/)
- [bible-api.com](https://bible-api.com/)
- [wldeh/bible-api (GitHub)](https://github.com/wldeh/bible-api)
- [World English Bible — public domain statement](https://worldenglish.bible/)
- [Bible Gateway API Developers (ProgrammableWeb)](https://www.programmableweb.com/api/bible-gateway/developers)
