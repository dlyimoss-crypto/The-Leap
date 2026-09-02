# The Leap — session summary

Everything discussed and built in this session, in order. Two phases: setting up the engineering skills used to plan the work, then the planning and implementation of The Leap itself.

## 1. Matt Pocock skills setup

Installed 24 of the 25 skills from [mattpocock/skills](https://github.com/mattpocock/skills) into `.claude/skills/` (his `code-review` was skipped — this session already has a built-in skill of that name). Ran the per-repo setup since the project had no git remote yet:

- **Issue tracker**: local markdown under `.scratch/<feature>/` — see `docs/agents/issue-tracker.md`
- **Triage labels**: kept the five defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) — see `docs/agents/triage-labels.md`
- **Domain docs**: single-context (`CONTEXT.md` + `docs/adr/`) — see `docs/agents/domain.md`
- Wrote the `## Agent skills` block into `CLAUDE.md`

## 2. The Leap — the product

Source: `The_Leap_White_Paper_V1.pdf` (white paper V1.0, Sept 2026), plus mockup screens shared in chat.

A Christ-centered digital discipleship platform — "birthed in Africa, built for the journey everywhere." Core movement: **CONNECT → COMMIT → EVOLVE → ENGAGE**, with **MULTIPLY** as the mature outcome. Tagline: *"Your essential companion in Christ."* Explicitly **not** a Bible app, social network, or AI pastor — the product's job is to help someone find their next concrete step with Christ.

## 3. Wayfinder planning — the MVP build map

Charted with the `wayfinder` skill in [.scratch/the-leap-mvp/map.md](.scratch/the-leap-mvp/map.md).

**Destination**: a build-ready V1 plan — architecture, data model, screens, visual identity — for a **web app**, built **solo with AI-assisted coding tools**, covering exactly the white paper's own MVP Scope Philosophy (§30). Everything it defers (books library, church network, social feed, mentorship marketplace, leadership programs, payments) and everything theological/legal/organizational (§48) was ruled **out of scope**.

All nine tickets resolved:

| # | Ticket | Decision |
|---|---|---|
| 01 | [Tech stack](.scratch/the-leap-mvp/issues/01-tech-stack.md) | TypeScript + Next.js + Supabase + Vercel, Tailwind CSS + shadcn/ui |
| 02 | [Data model](.scratch/the-leap-mvp/issues/02-data-model.md) | Formation content is content-as-code (per-language directories), not DB rows — makes growing to 5 languages a directory addition, not a migration. ~13 Postgres tables for everything else (profiles, progress, reflections, commitments, prayer requests, posts, moderation, notifications, Companion messages) |
| 03 | [Bible licensing](.scratch/the-leap-mvp/issues/03-bible-licensing.md) | Self-hosted public-domain text (WEB primary) for V1, free and unrestricted; API.Bible's Express Licensing for modern translations once there's revenue |
| 04 | [Companion architecture](.scratch/the-leap-mvp/issues/04-companion-architecture.md) | Claude API; three scoped capabilities (session Q&A, Socratic reflection help, "I'm Stuck" routing with honest "not available yet" for mentor/church); reuses the crisis-keyword module from ticket 08 |
| 05 | [Visual identity](.scratch/the-leap-mvp/issues/05-visual-identity.md) | An ascending-steps-into-a-leap mark (not the white paper's literal foot sketch), orange/ember accents on warm-white/deep-navy grounds, Sora + Karla type. [Artifact](https://claude.ai/code/artifact/86f49123-602a-4acb-9919-b4f4ec7ce665) |
| 06 | [Prayer Room / Community / Admin screens](.scratch/the-leap-mvp/issues/06-remaining-screens.md) | Testimony is a column on `prayer_requests`, not a table; Community's daily prompt is a content file; Admin is exactly Moderation Queue + Users. [Artifact](https://claude.ai/code/artifact/1910d5d5-bd00-4654-9405-ada404a9e2bc) |
| 07 | [Language launch scope](.scratch/the-leap-mvp/issues/07-language-scope.md) | English-only for V1; Swahili, French, German, Chinese come later as content additions |
| 08 | [Safety/moderation flow](.scratch/the-leap-mvp/issues/08-safety-flow.md) | Report auto-hides content into a founder-reviewed queue; non-AI keyword scan shows a crisis-support banner (findahelpline.com) to the author only, without hiding the post; user-to-user `blocks` and admin-only `is_banned` are separate mechanisms |
| 09 | [Notifications](.scratch/the-leap-mvp/issues/09-notifications.md) | In-app only (Supabase Realtime), three event types only (prayer response, comment, moderation action) — no push/email, no per-reaction or devotion-reminder notifications |

## 4. Implementation — what's built

Thirteen commits, each typechecked, linted, tested, and verified before committing. Code review (via `/code-review`) ran on every slice — it caught and fixed a path-traversal gap, a prototype-pollution-style lookup bug, an accessibility regression, redundant file I/O, a bug introduced by a review-driven refactor itself, and — in the Admin slice — a real privilege-escalation hole (below).

**Content-only slices (no database needed):**

1. **Scaffold** — Next.js (App Router) + Supabase schema (full V1 tables + RLS, as a migration) + the brand design tokens (light/dark mode) applied to the theme
2. **`crisis-detection` module** — TDD'd, 7 red-green cycles, catches the five categories from ticket 08 including a smart-quote normalization fix
3. **Faith in Christ content + loader** — the white paper's 7-day journey transcribed to content-as-code, plus a tested `getJourneyMeta`/`getJourneySession` loader
4. **Landing, journey, and session screens** — real navigable pages; the white paper's onboarding personalization quiz was deliberately skipped since only one journey exists to recommend into it
5. **Bible text provider** — real WEB translation text for all 24 references the journey cites, sourced with `curl` (not a summarizing fetch tool, to guarantee exact wording) and wired into the session screen with per-passage citations
6. **`getScripturePassages` extraction** — deduplicated and tested the reference-splitting logic that had been inline in the page
7. **Branded 404 page**
8. **Community daily-prompt loader** — seven authored prompts as content files

**Database-backed slices** (a Supabase project was created mid-session at `frggbutmtxnkdjghdbch`, migration `0001_init.sql` applied, `.env.local` populated):

9. **Auth** — email/password via `@supabase/ssr`, no email-confirmation gate (a product decision, not an oversight), profile row auto-created by a `security definer` trigger on `auth.users` since `profiles` has no client-facing INSERT policy
10. **Progress tracking + real Home** — completing a session calls an atomic `record_session_completion()` RPC (a client-side read-then-upsert would race under a double-submitted form); Home now branches on auth, showing the marketing welcome view when signed out or the current journey's progress/Next Step when signed in
11. **Prayer Room** — Requests/Testimonies/Mine tabs, public/private × identified/anonymous composer, one-directional "I Prayed", mark-answered-with-testimony, crisis-detection wired to auto-file a founder-review report and show the crisis banner once. Reporting someone else's request needed a new `report_content()` RPC, since the owner/admin-only update policy blocks a non-owner from flipping status to `hidden`
12. **Community** — feed with the daily-prompt composer, toggleable Encourage/Pray reactions, a post-detail page with comments, Report (reuses `report_content()`) and Block (direct insert — `blocks`' RLS already lets a user manage their own block list). `requireUser`/`requireActiveUser` extracted to `src/lib/supabase/authorize.ts`, shared with Prayer Room, after review caught the duplicated version missing the `is_banned` check on comments
13. **Admin** — Moderation Queue (reports joined against their polymorphic target across posts/comments/prayer_requests, auto-crisis-flagged visually distinct from user-reported, Restore/Remove/Ban) and Users (Ban/Unban), gated on `profiles.role = 'admin'` (set manually in the Supabase dashboard, per ticket decision). Banning needed a `set_user_banned()` RPC for the same owner-only-update reason as reporting. Code review then caught that `profiles`' UPDATE policy restricted *which row* a user could touch but not *which columns* — any signed-in user could have set their own `role` to `admin` or flipped `is_banned` back to `false` directly. Fixed with a column-level `REVOKE`/`GRANT` (migration `0006`) and verified the exploit is closed.

## 5. Current state

Every V1 screen from the wayfinder map is built and functional against the live database: auth, the Faith in Christ journey with real progress tracking, Prayer Room, Community, and Admin. All nine wayfinder tickets' decisions are implemented; nothing from the MVP scope remains unbuilt.

**Housekeeping, not urgent:**
- A number of `test-*@gmail.com` accounts accumulated in Supabase Auth from verifying each slice against the live database — safe to delete from **Authentication → Users** for a clean slate before real users sign up.
- No user has `role = 'admin'` yet outside test accounts — promote a real account by hand in the Supabase dashboard's table editor when ready to use `/admin`.

**Next step**: deploy to Vercel, with the same `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and `ANTHROPIC_API_KEY`, once the Leap Companion is built) set as environment variables there.
