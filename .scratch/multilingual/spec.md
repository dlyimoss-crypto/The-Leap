# Multilingual support — audit and implementation plan

Status: ready-for-agent (plan approved 2026-11-18; decisions recorded in §K). Done: all phases (1–4, 6, 7) as of 2026-11-19. Guide: docs/localization.md; ADR: docs/adr/0002-localization-architecture.md.

Source brief: "The Leap App — Multilingual Support & Global Localisation" (pasted 2026-11-18).

## A. Audit of the current application

**What it is.** A Next.js 16 (App Router) web app / installable PWA, served from Vercel (`dub1`), backed by Supabase (Postgres + Auth + Storage, `eu-west-1`). It is **not** React Native/Expo, so `react-i18next` + `expo-localization` from the brief do not apply.

**Rendering.** Mostly React Server Components that read Supabase directly; mutations are Server Actions (`actions.ts` per route). No client-side state library and no client data cache; per-request deduplication uses React `cache()`.

**Auth.** Supabase email/password via `@supabase/ssr`, session cookies refreshed in `proxy.ts`. Helpers live in `src/lib/supabase/authorize.ts` (`getAuthedUser`, `getProfile`, `requireUser`, `requireActiveUser`).

**Navigation.** `src/components/bottom-nav.tsx`: Home + CONNECT / COMMIT / EVOLVE / ENGAGE, plus Admin / Inbox for team roles.

**Interface text.** There is already an in-house i18n layer:
- `src/lib/i18n/dictionaries.ts`: one typed `Dictionary` object, English + Swahili (~390 keys)
- `src/lib/i18n/get-locale.ts`: signed in → `profiles.preferred_language`; guests → always English
- Profile page has an English/Swahili switch; the Leap Companion is told to reply in Swahili when `sw` is selected

Coverage is partial: **15 of 75** page/component files use the dictionary. The other 60 contain hardcoded English, including Commit, Evolve (devotion, scripture, books), Engage, Connect, Community, Prayer Room, journeys, Ask PD, and the 2,400-line Admin page.

**Content storage.** Everything is database-driven except Scripture and community prompts:

| Content | Where | Translatable fields |
|---|---|---|
| Journeys | `journeys` | title, purpose, completion_title |
| Journey days (Formation Loop) | `journey_days` | title, explore, reflect, pray, practice, connect, next_topic (`scripture_reference` stays canonical) |
| Daily devotions | `devotions` (author-written) | title, body, practice / reflection / prayer fields |
| Announcements | `prayer_movements` | title, body, prayer points |
| Service opportunities, churches | own tables | descriptive text |
| Books | `books` + Storage files | metadata only (the PDF/EPUB file is the author's work) |
| Community daily prompts | `content/community-prompts/*.json` | prompt text |
| Bible | `content/bible/bsb/bsb.json` (Berean Standard Bible, English only) | needs licensed translations, not AI |
| User-generated (posts, comments, prayer requests, reflections, Ask PD) | own tables | **not translated**: the user's own words |

**User progress** (`journey_progress`, `session_completions`, `reflections`, `devotion_reads`, `scripture_bookmarks`, commitments) is keyed by content id / day number / canonical reference, never by language. **Switching language cannot disturb progress**, and no changes are needed there.

**Profile.** `profiles.preferred_language text default 'en' check in ('en','sw','fr','de','zh')`. It is column-grant-updatable by its owner (migration 0006), so the plumbing for syncing across devices already exists.

**Formatting.** 11 call sites format dates/times, most hardcoded to `"en-US"`.

**Fonts.** Sora + Karla via `next/font`, Latin subset only. Chinese currently falls back to whatever the OS has.

**Offline.** `public/sw.js` only handles push notifications; it says "No offline caching". There is no offline reading today.

**Notifications.** Daily devotion web-push (cron at `src/app/api/cron/devotion-reminders`) with English copy built on the server. Auth emails go through Supabase templates + Resend, English only.

**RTL.** `<html>` has no `dir` attribute; ~36 physical-direction Tailwind classes (`ml-`, `pr-`, `left-`…) would need logical equivalents (`ms-`, `pe-`, `start-`).

**Roles.** `profiles.role` is `user` / `admin` / `pastor`. There is no translator or reviewer role.

### Risks and conflicts found
1. The DB check constraint allows `zh` but not `zh-CN`/`zh-TW`/`es`; it needs a migration.
2. `src/lib/content/translations.ts` already uses the word "translation" for **Bible** translations (BSB/KJV/ASV). The new content-translation system needs distinct naming (we'll call it *localization*).
3. Admin is one 2,400-line file. Translation review should be a separate `/admin/translations` route rather than more code in that file.
4. Supabase auth emails support one template per type. Localizing them means branching on a `locale` stored in user metadata inside the Go template. That's doable but fiddly.
5. Nothing gets published without native reviewers (a deliberate rule). Until each language has a reviewer, its content will show the "available in English" fallback.
6. Offline reading is a new capability, not just localization. It's scoped as its own phase.

## B. Technology stack

TypeScript · Next.js 16.4 App Router (RSC + Server Actions) · React 19 · Tailwind CSS v4 + shadcn/ui (Base UI) · Supabase (Postgres with RLS, Auth, Storage) · Vercel · Anthropic SDK (Leap Companion) · web-push · Vitest + Testing Library.

## C. Recommended architecture

### C1. Interface translations: extend the existing in-house layer, no new library
The existing pattern (a typed dictionary chosen on the server) already fits RSC well. Changes:
- `Locale = "en" | "de" | "fr" | "es" | "sw" | "zh-CN" | "zh-TW"` in one `locales.ts` registry, with native name, `dir`, font stack and Bible translation per locale. Adding a language later = one registry entry + one folder.
- Split into `src/lib/i18n/messages/<locale>/<namespace>.ts` (common, onboarding, auth, nav, home, journeys, devotions, scripture, prayer, community, profile, settings, notifications, errors, admin).
- **English is the type source.** Other locales are typed `Messages`, so a missing key is a compile error rather than leaked English.
- Pluralisation via `Intl.PluralRules`; dates/numbers via `Intl.DateTimeFormat`/`NumberFormat` with the active locale (small helpers in `src/lib/i18n/format.ts`).
- Only the active locale's dictionary is imported (`import()` per locale on the server), so other languages add no bundle weight.
- Alternative considered: `next-intl`. It's mature, but adopting it means rewiring every current dictionary call site for little gain. Not recommended unless you'd prefer a standard library.

### C2. Locale resolution and selection
Order: signed-in profile `preferred_language` → `leap_locale` cookie → `Accept-Language` negotiation against supported locales → `en`. Never derived from geography.
- First visit: a small dismissible suggestion ("Use The Leap in Deutsch?") when the device language is supported, plus a language selector on the welcome screen and in sign-up.
- Choosing a language sets the cookie, and also the profile if signed in. On sign-in, the profile value wins, which syncs it across devices.
- Profile → Language becomes a list showing native names (English, Deutsch, Français, Español, Kiswahili, 简体中文, 繁體中文).
- `<html lang dir>` is set from the active locale. URLs stay unchanged (no `/de/...` prefixes): the app is mostly behind sign-in, and prefixes would touch every route.

### C3. Content localization: per-type sibling tables
One table per translatable content type, rather than one generic JSON table, so each keeps real columns, constraints and clear RLS:

```
journey_localizations      (journey_id, locale, title, purpose, completion_title, …common)
journey_day_localizations  (journey_day_id, locale, title, explore, reflect, pray, practice, connect, next_topic, …common)
devotion_localizations     (devotion_id, locale, title, body, practice, …common)
announcement_localizations (prayer_movement_id, locale, title, body, …common)
-- common: status, source_version, origin ('ai'|'human'), reviewed_by, reviewed_at, updated_at; unique (source_id, locale)
```
- Source rows get `content_version int`, bumped by a trigger whenever a translatable column changes. A localization stores the `source_version` it was translated from; a mismatch means **Outdated** (a trigger flags it).
- Status: `pending → translating → awaiting_review → (needs_revision ↺) → approved → published`, plus `outdated`.
- **RLS:** readers see only `published` rows of published sources; reviewers can edit drafts only in their assigned languages; only reviewers/admins can publish. English source rows are never written by the localization path. Writes go through `security definer` RPCs that check role and status transitions, like `report_content()` already does.
- `localization_events`: an append-only audit log (who, what, from/to status, when).
- `translation_reviewers (user_id, locale)` assigns reviewers per language without changing `profiles.role`.
- Community prompts (JSON files) get per-locale files next to the English ones, the same pattern as content-as-code.

**Reading.** Loaders take a locale and return `{ content, servedLocale }`. If no published localization exists, the page shows the user's-language notice "This isn't available in Deutsch yet" with **Read in English**. The whole item is then served in English (marked `lang="en"`). There's never a blank screen, and languages are never silently mixed inside one item.

### C4. AI translation workflow
- A server-only module, `src/lib/localization/translate.ts`, reuses the Anthropic SDK and key already used by the Companion (never exposed to the browser).
- The prompt includes that language's theological glossary and explicit fidelity rules: no new theology, keep Scripture references canonical, keep tone.
- Jobs: an admin clicks **Translate missing** (or a cron later processes `pending` rows). Each Vercel invocation handles one item, staying inside function time limits.
- AI output lands as `awaiting_review`. **Nothing publishes automatically.**
- `glossary_terms (locale, source_term, approved_term, notes, updated_by)` is seeded with the brief's list (grace, salvation, redemption…) and editable by that language's reviewers.

### C5. Scripture
Store references canonically (English book names as today) and display localized book names. The Bible text comes from **licensed or public-domain editions only, never AI**:

| Locale | Candidate | Licensing |
|---|---|---|
| de | Luther 1912 | public domain |
| fr | Louis Segond 1910 | public domain |
| es | Reina-Valera 1909 | public domain |
| zh-CN / zh-TW | Chinese Union Version (1919), simplified / traditional | public domain |
| sw | Swahili Union Version | **copyright status must be verified before use** |

Where no edition is available, show the reference, the English text labelled "Berean Standard Bible (English)", and a short note. The existing Scripture translation picker (`TRANSLATIONS`) becomes per-locale.

### C6. Other surfaces
- **Leap Companion:** generalise the Swahili-only language line to every locale.
- **Push reminders:** build the copy from the recipient's `preferred_language`.
- **Auth emails:** write the locale into user metadata at sign-up and on change, and branch in the Supabase templates.
- **Chinese fonts:** a system CJK font stack (`PingFang SC/TC`, `Microsoft YaHei/JhengHei`, `Noto Sans CJK`) applied only when the locale is zh-*, with slightly increased line-height. This avoids multi-megabyte web-font downloads.
- **Long German/Swahili strings:** audit buttons and headings for `truncate`/fixed widths and allow wrapping.
- **RTL readiness:** convert the ~36 physical classes to logical ones and mirror directional icons (chevrons, back arrows) under `dir="rtl"`.

### C7. Offline (separate phase)
Extend `sw.js` to cache the app shell and **already-opened** devotions / journey days for the active locale (stale-while-revalidate), keyed by locale. Interface dictionaries are server-rendered into pages, so they come along for free. Nothing is pre-downloaded for other languages.

## D. Database changes (all additive; nothing dropped or rewritten)
1. Widen the `profiles.preferred_language` check to the new codes and migrate any `zh` → `zh-CN`.
2. Add `content_version` + bump triggers on `journeys`, `journey_days`, `devotions`, `prayer_movements`.
3. Add the four `*_localizations` tables + RLS + status-transition RPCs.
4. Add `localization_events`, `translation_reviewers`, `glossary_terms`.

Each change is a numbered migration (0038+), reviewed with you before being applied to the live project.

## E. Dependencies
None required. `Intl` covers plurals, dates and numbers; the Anthropic SDK and web-push are already installed. Bible editions are data files, not packages.

## F. Security and performance
- The AI key stays server-only, as today. Localization writes go only through RLS + `security definer` RPCs with role and locale checks. English source rows are not writable from the localization path. Every status change is logged.
- Readers can't see unpublished drafts (RLS, not just UI).
- Performance: one extra indexed lookup per content page (`source_id, locale`); only the active locale's dictionary loads; there are no AI calls on read; CJK fonts are system fonts.

## G. Phases
1. **Foundation:** locale registry, resolution (profile/cookie/header), selector on welcome / sign-up / Profile, `<html lang dir>`, format helpers, DB check migration. *Small.*
2. **Interface extraction:** move all hardcoded strings into namespaces (English first, keeping UI behaviour identical), then generate de/fr/es/zh-CN/zh-TW drafts for native review; layout pass for long strings and CJK. *Largest phase: 60 files.*
3. **Content localization:** tables, RLS, loaders with fallback, community prompts, Companion, push copy.
4. **AI translation + review:** translate module, glossary, `/admin/translations` (coverage %, queue, review/edit/approve, outdated list, history).
5. **Scripture:** ingest public-domain editions, localized book names, per-locale picker.
6. **Offline reading:** service-worker caching.
7. **QA + docs:** test matrix (§J), `docs/localization.md` (adding a language, translating, approving), ADR for the architecture.

Each phase ends typechecked, linted, tested, built and verified in the running app before the next starts.

### C7 as built (2026-11-19)
Network-first rather than stale-while-revalidate, so pages never show stale progress while online; the saved copy is used offline or after 6 s on a slow connection. Saved pages belong to one signed-in reader and language: the root layout tells the worker who's signed in, and a sign-out, account switch or language change discards them (no keying per locale needed). Nothing is saved while signed out. Rules in `public/sw-rules.js` (unit-tested), worker in `public/sw.js`, fallback page `/offline` (static, all languages, lists saved pages). Service workers are disabled in Safari Lockdown Mode, so offline reading (and push) won't work there.

## H. Risks to existing functionality
- Phase 2 touches nearly every screen. Mitigation: English output must be byte-identical before and after extraction (snapshot tests on key screens), and the work ships in small per-area commits.
- The guest locale cookie adds a cookie to every request (it's tiny; `proxy.ts` already runs on every request).
- Admin page: kept untouched apart from a link; review lives on its own route.
- Supabase email template edits are live immediately, so test them on a test account first.

## I. Files likely to change or be created
**Create:** `src/lib/i18n/locales.ts`, `src/lib/i18n/messages/<locale>/*.ts`, `src/lib/i18n/format.ts`, `src/lib/i18n/negotiate.ts` (+ tests), `src/components/language-selector.tsx`, `src/lib/localization/{load,translate,glossary}.ts` (+ tests), `src/app/admin/translations/**`, `supabase/migrations/0038+_*.sql`, `content/bible/<edition>/`, `content/community-prompts/<locale>/`, `docs/localization.md`, `docs/adr/0002-localization-architecture.md`.
**Modify:** `src/lib/i18n/dictionaries.ts` + `get-locale.ts` (become the registry-backed loader), `src/app/layout.tsx` (lang/dir/fonts), `proxy.ts` (cookie), `src/app/profile/*`, `src/app/sign-in/*`, onboarding/welcome (`dashboard-view.tsx`, `page.tsx`), every page under `src/app/**` for string extraction, `src/lib/supabase/journeys-repo.ts` / `journeys.ts` / devotion + announcement loaders, `src/lib/content/scripture.ts` + `translations.ts`, `src/app/companion/actions.ts`, `src/lib/devotion-reminders.ts`, `public/sw.js`, `globals.css`.

## J. Testing strategy
- **Unit (Vitest):** locale negotiation (Accept-Language edge cases, zh-Hant→zh-TW, unsupported→en), plural/date helpers per locale, loader fallback (`servedLocale`), status-transition rules, outdated detection.
- **Type-level:** every locale must satisfy `Messages`; a missing key fails `tsc`.
- **Database:** RLS checks with real sessions as reader / reviewer-of-other-language / admin (the same style used to verify migration 0006).
- **In the app:** each locale walked through welcome → sign-up → journey day → devotion → Prayer Room → Profile switch → sign-out/in (persistence) → second browser (sync); screenshots at 360px width for German/Swahili overflow and CJK rendering; `dir="rtl"` smoke test with a pseudo-locale.
- **Regression:** existing suite + build each phase; English screens are compared before and after extraction.

## K. Decisions (answered 2026-11-18)
1. **Reviewers: keep it simple.** No per-language reviewer table. Any `admin` can approve and publish translations from the admin area. Drop `translation_reviewers` from §D.
2. **Outdated translations: keep serving.** Readers keep seeing the last published translation. Admins see it flagged `outdated` in the review queue.
3. **Interface strings ship without approval.** AI-drafted UI text (buttons, labels) goes live directly and is corrected later as needed. Devotions, journeys and other teaching content always need admin approval.
4. **Bible: unchanged.** No Bible translations, no Swahili Bible, no localized book names. Scripture stays the BSB (English) in every language. §C5 is out of scope; Phase 5 is dropped.
5. **Offline reading: in scope now** (Phase 6 stays).
6. **Books: unchanged.** No translation of book metadata or files.
7. **Traditional Chinese dropped** (2026-11-18): only Simplified Chinese (`zh-CN`) is offered. Traditional-Chinese devices are offered Simplified Chinese as a suggestion. Re-adding it later = a `messages/zh-TW/` folder + registry entry + migration.
