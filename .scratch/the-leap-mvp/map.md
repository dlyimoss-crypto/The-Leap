# The Leap — MVP Build Plan

## Destination

A build-ready V1 (MVP) implementation plan for The Leap — architecture/stack, data model, screen specs, and visual identity — sized for **solo, AI-assisted-coding development of a web app**, covering exactly the feature list in the white paper's MVP Scope Philosophy (§30): auth/profile, onboarding, Home/Next Step, Scripture/devotional experience, the "Faith in Christ" formation journey, progress tracking, reflection/journal, basic prayer room, basic community discussion, notifications, admin/content management, basic analytics, safety/moderation, and a limited Leap Companion. Everything the white paper explicitly defers (books/literature library, church network, social feed, mentorship marketplace, leadership programs, payments) stays out of this map.

## Notes

- Source of truth for vision/brand/content: `~/Desktop/The_Leap_White_Paper_V1.pdf` (White Paper V1.0, Sept 2026). Its §14 already fully specifies Day 1–7 of the "Faith in Christ" journey content — that's an asset to transcribe, not a decision to make.
- Domain vocabulary lives in [CONTEXT.md](../../CONTEXT.md) — consult `domain-modeling` when new terms come up.
- Platform is a **web app** (not native mobile), built solo with AI-assisted coding tools. No dev team, no agency.
- No monetization/payments in V1 — the white paper's own priority list has none, so pricing/payment-processor decisions are irrelevant until a later map.
- **Override of "plan, don't do"**: ticket 05 (logo/color/visual identity) was resolved during charting itself, at the user's explicit request in the message that opened this effort, rather than deferred to a later session.
- Consult `grilling` + `domain-modeling` for grilling-type tickets; `prototype` for prototype-type tickets; `research` for research-type tickets, per the standard wayfinder invocation.

## Decisions so far

- [Logo, color system & light/dark mode](./issues/05-visual-identity.md): An ascending-steps-into-a-leap mark (not the white paper's literal foot/step sketch), orange/ember accents on warm-white (light) and deep-navy (dark) grounds, Sora + Karla type pairing. Presented at https://claude.ai/code/artifact/86f49123-602a-4acb-9919-b4f4ec7ce665.
- [Bible text source & licensing](./issues/03-bible-licensing.md): Self-hosted public-domain text (WEB primary, KJV/ASV alternates) for V1, free and unrestricted; add API.Bible's Express Licensing for modern copyrighted translations once there's revenue. Build behind a swappable `BibleProvider` interface.
- [Tech stack](./issues/01-tech-stack.md): TypeScript + Next.js + Supabase + Vercel, with Tailwind CSS + shadcn/ui for styling. Unblocks tickets 02 and 09.
- [Data model](./issues/02-data-model.md): Formation content is content-as-code (per-language directories, not DB rows) so growing to 5 languages is free of migrations; Postgres tables cover progress, reflections (always private), commitments, prayer requests (public/private × identified/anonymous), one flat community space (no groups in V1), moderation, and notifications. "Admin/content management" (V1 item 11) is now mostly moderation UI, not a CMS.
- [Safety/moderation flow](./issues/08-safety-flow.md): report auto-hides content into a founder-reviewed queue (restore or permanent soft-delete); a non-AI keyword scan on posts/prayer requests shows an immediate crisis-support banner (findahelpline.com) without hiding the content; user-to-user `blocks` and an admin-only `is_banned` flag are separate mechanisms. Adds `blocks` table and widens `status` enums on ticket 02's schema.
- [Prayer Room, Community & Admin screens](./issues/06-remaining-screens.md): [prototype](https://claude.ai/code/artifact/1910d5d5-bd00-4654-9405-ada404a9e2bc). Testimony is a column on `prayer_requests`, not a table; Community's daily prompt is a content file; Admin is exactly Moderation Queue + Users.
- [Language launch scope](./issues/07-language-scope.md): English-only for V1 — Swahili, French, German, and Chinese come later as content additions, not a rebuild, against ticket 02's per-language directory structure.
- [Companion architecture](./issues/04-companion-architecture.md): Claude API; three V1 capabilities (session Q&A, Socratic reflection help, "I'm Stuck" routing with honest placeholders for mentor/church); ticket 08's crisis-keyword module reused and run twice (user message + model reply) rather than trusting the prompt alone; conversation history persisted in `companion_messages`, owner-only RLS, no retention complexity. Also cleared the "Next-Step Engine" fog item — it's deterministic from `journey_progress`, no engine to build.
- [Notifications](./issues/09-notifications.md): in-app only (`notifications` table + Supabase Realtime), no push/email until usage data justifies it. Three types only — prayer response, comment received, content moderated — with reactions and devotion reminders explicitly excluded per the white paper's own anti-manipulation UX principles.

## Not yet specified

- **Full UX microcopy pass**: beyond the white paper's sample lines, every screen still needs final copy. Depends on ticket 06 (resolved) but hasn't been done yet — a fast-follow, not a ticket of its own.

## Out of scope

- **Deferred features** (per the white paper's own MVP Scope Philosophy and the user's confirmation to target MVP-only): books/literature library, church network, X-style social feed, mentorship/coaching marketplace, LEAP LEAD leadership programs, The Real Edge, large-scale mission logistics, multiple premium tiers. These return only as fresh effort maps once V1 ships, not as a resumption of this one.
- **Theological/legal/organizational decisions** (white paper §48, non-technical subset): Statement of Faith and theological governance, legal entity structure and jurisdiction, editorial/theological advisory board, mentor-verification *policy* authorship, organization-partner verification process, pricing/regional pricing strategy, payment processor selection, brand trademark/domain review, app-store accounts (moot — this is a web app), impact-measurement/reporting definitions. Real work, but a different kind of work than an engineering wayfinder map charts.
