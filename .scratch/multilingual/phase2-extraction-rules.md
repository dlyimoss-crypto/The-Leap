# Phase 2 — interface string extraction: rules

Goal: every piece of user-facing interface text in your assigned files comes from the i18n dictionary, in **English and Swahili**. Other languages (de/fr/es/zh) are added later from the finished English files.

Read first: `src/lib/i18n/dictionaries.ts`, `src/lib/i18n/format.ts`, `src/lib/i18n/get-locale.ts`, `src/lib/i18n/messages/en/*.ts`, and an already-converted example: `src/app/profile/page.tsx`, `src/app/sign-in/page.tsx` + `sign-in-form.tsx`, `src/app/dashboard-view.tsx`. Also `CONTEXT.md` for domain vocabulary.

## Hard rules

1. **English output must be byte-identical** to today. Copy each string exactly, including punctuation, curly quotes, em dashes and capitalisation. Don't fix or improve wording.
2. **Only edit your assigned files and your namespace files** (`src/lib/i18n/messages/en/<ns>.ts` and `src/lib/i18n/messages/sw/<ns>.ts`). Other agents are editing other areas of the same working tree at the same time. Do not touch `dictionaries.ts`, `messages/*/index.ts`, `messages/*/core.ts`, or another area's files. Do not run `git` commands that change state (no commit, stash, checkout, reset, add).
3. **Do not translate content**: database rows (journey/day text, devotions, announcements, books, posts, prayer requests, church/service listings), Scripture/Bible text, book titles, user names. Only the interface around them. Content localization is a later phase.
4. **Brand and domain names stay as-is** in every language: "The Leap", "Leap Companion" (Swahili already uses "Rafiki wa Leap" — follow `messages/sw/core.ts`), "Ask PD", "Pastor Deniss", "PD team", CONNECT / COMMIT / EVOLVE / ENGAGE as they appear in `messages/sw/core.ts` nav.
5. **Structure:**
   - Namespace object in `messages/en/<ns>.ts`, grouped by screen/component, e.g. `commit.journeyDay.markComplete`. Keep keys descriptive camelCase.
   - English file is the type source (`typeof`). Swahili file must satisfy that type: any missing key fails `tsc`.
   - **Server components** call `getDictionary(await getLocale())` (both are React-`cache`d / cheap). **Server actions** that return user-visible messages do the same.
   - **Client components** (`"use client"`) receive the strings they need as props from their server parent (a namespace slice, e.g. `dict={dict.commit.composer}`). **Functions cannot be passed to client components** — for client-side values/plurals use string templates with `{name}` placeholders and `interpolate` / `plural` from `src/lib/i18n/format.ts` (pass the `locale` string as a prop too).
   - Function-valued messages (`(n: number) => string`, annotate the parameter types) are fine when used only in server components.
   - Plurals: use `plural(locale, n, { one, other })` rather than `n === 1 ? …` in new code. Swahili has its own forms (see `daysLeft` in `messages/sw/core.ts` for the "Siku 1 imebaki / Siku 3 zimebaki" style).
   - Dates/times/numbers: replace hardcoded `"en-US"` / `toLocaleDateString` with `formatDate` / `formatTime` / `formatNumber` from `format.ts` using the active locale, keeping the same options, so English output stays the same.
   - `aria-label`, `title`, `placeholder`, `alt` text, confirmation prompts, toast/empty states, error messages and metadata `title`s are all user-facing: extract them.
   - Push-notification and email copy built on the server: use the **recipient's** `profiles.preferred_language` (validated with `isLocale` + `isEnabledLocale`, falling back to `en`), not the request's locale.
6. **Swahili quality**: natural, warm, Tanzanian-standard Swahili matching the tone of `messages/sw/core.ts`, reusing its existing terms (e.g. Ibada = devotion, Maandiko = Scripture, Safari = journey, Ahadi = commitment, Maombi = prayer, Jumuiya = community, Tangazo = announcement). Keep Christian vocabulary consistent with the Swahili Union Version tradition (Bwana, Yesu Kristo, Roho Mtakatifu, neema, wokovu, toba, imani, haki).
7. Don't add dependencies. Don't restructure components beyond what's needed to pass strings in.

## Done means

- `npx tsc --noEmit` reports **no errors in your files** (ignore errors in files you don't own — other agents are mid-edit; report them but don't fix them).
- `npx eslint <your files>` clean.
- `npx vitest run` for any tests touching your files passes; update tests only if they assert on strings you moved (keep the same English).
- No hardcoded English UI text left in your files (grep to check: JSX text, string props, template literals).
- Do **not** start `next dev` / `next build` (the coordinator does that once all areas finish).

## Report back (concise)

- Files changed, namespace keys added (counts are fine).
- Anything you deliberately left in English and why.
- Any string whose Swahili you're unsure of.
- Any behaviour you had to change (should be none).
