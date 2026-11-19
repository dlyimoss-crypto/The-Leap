# Localization

The Leap is available in English, Kiswahili, Deutsch, Français, Español and 简体中文. This guide covers how languages work, how to translate and publish content, and how to add a language. The reasons behind the design are in [ADR 0002](adr/0002-localization-architecture.md).

Two kinds of text are translated differently:

| | Interface text (buttons, labels, headings, errors) | Teaching content (journeys, journey days, devotions, announcements) |
|---|---|---|
| Lives in | `src/lib/i18n/messages/<locale>/*.ts` | `*_localizations` tables in Supabase (migration 0039) |
| Written by | Developers (AI-drafted, checked by native speakers) | AI draft in **Admin → Translations**, then an admin |
| Goes live | When deployed, without formal approval | Only when an admin clicks **Approve & publish** |
| If missing | Compile error (can't happen in production) | The English original, with a "Not yet translated" notice |

Not translated: anything people write themselves (posts, comments, prayer requests, reflections, Ask PD), the Bible (always the Berean Standard Bible), and books.

## How a reader's language is chosen

`getLocale()` in `src/lib/i18n/get-locale.ts`:

1. Signed in: `profiles.preferred_language`, so the choice follows the person to every device.
2. Otherwise: the `leap_locale` cookie, set by any language picker on this device.
3. Otherwise: English.

The device's own language is never applied silently. It is only offered once, through the "Use The Leap in Deutsch?" suggestion (`getSuggestedLocale`). Language is never inferred from location. URLs carry no language prefix.

Changing language anywhere (welcome screen, sign-in, Profile, the suggestion) goes through `setLocale` in `src/lib/i18n/actions.ts`. That action writes the cookie and, when the person is signed in, their profile as well. Progress (journeys, devotions read, bookmarks, commitments) is stored by content id, never by language, so switching language can't lose anything.

`<html lang dir>` comes from the active locale. Content shown in English inside another language is marked `lang="en"`.

## Interface text

- **English is the source of truth.** `messages/en/<area>.ts` defines every key. Every other language is typed from it, so a missing or misspelt key fails `tsc`.
- **Adding a string:** add it to the English file first, then to each other language. `npx tsc --noEmit` lists the languages still missing it.
- **Getting the dictionary:** use `getDictionary(await getLocale())` in server components, and pass the strings a client component needs down as props.
- **Plurals, dates and numbers:** use the helpers in `src/lib/i18n/format.ts`, which wrap `Intl`. Don't hardcode `"en-US"`.
- **Text with values in it:** messages that interpolate values are functions, and they can only be used in server components. Client components get plain strings.
- **Layout:** use logical Tailwind classes (`ms-`, `pe-`, `start-`, `end-`, `text-start`) instead of `ml-`, `pr-`, `left-`, `text-left`, so layouts mirror in a right-to-left language. Arrows and chevrons are flipped under `dir="rtl"` by a rule in `globals.css`. German and Swahili run long, so let buttons and headings wrap rather than `truncate` them.
- **Wording:** each language's chosen theological and app terms are in `.scratch/multilingual/glossary/<locale>.md`. Phrases still worth a native speaker's check are listed in `.scratch/multilingual/translation-review.md`. The crisis banner and the sinner's prayer are the most important.
- **The Leap Companion** replies in the reader's language automatically (`src/app/companion/actions.ts`).
- **Daily push reminders** are written in each recipient's language.
- **Community daily prompts:** the English ones are in `content/community-prompts/<date>.json`. Translations go in `content/community-prompts/<locale>/<date>.json`. A missing translation shows the English prompt.

## Translating and publishing content (admins)

Everything happens in **Admin → Translations** (`/admin/translations`).

1. **Pick a language.** The overview lists every journey, journey day, devotion and announcement with its status in that language: not started, awaiting review, needs revision, approved, published. Items whose English has changed since they were translated are marked **outdated**.
2. **Draft with AI.** Either draft one item from its editor, or use **Draft all not-started with AI**. Drafts use the language's glossary and keep Scripture references unchanged. They always arrive as *awaiting review*, never published.
3. **Review.** The editor shows the English beside the translation. Read the whole item and fix anything off, especially theology, tone and the terms in the glossary. The AI's notes, such as uncertain terms or Bible quotations, appear above the form.
4. **Then choose one of:**
   - **Approve & publish:** readers in that language see it right away.
   - **Save draft:** keep your edits for later.
   - **Send back for revision:** mark it *needs revision*, with a note.
   - **Unpublish:** take a published translation down. Readers get the English original again.
5. **When the English changes,** the translation is flagged *outdated*, but readers keep seeing the last published version until an updated translation is approved. Redrafting an outdated item only fills the form. Nothing changes for readers until you publish.

Every status change is recorded, with who made it and when, in the item's **History**. A database trigger writes this, so it can't be skipped.

**Glossary.** Admin → Translations → Glossary lists the approved term for each key word in each language (grace, salvation, repentance, the movement names…). The AI follows it in every draft. Fix a term there once rather than in every item.

Any admin can approve and publish. There is no separate reviewer role, so ideally the person who approves is a native speaker.

## Offline reading

Pages a signed-in reader opens while online stay readable without a connection: Home, devotions, journeys and journey days, Scripture, and announcements. The service worker is `public/sw.js`, and its rules are in `public/sw-rules.js`.

- **Fetching:** network first. The saved copy is used offline, or after 6 seconds on a slow connection.
- **Privacy:** saved pages belong to one reader in one language. Signing out, switching account or changing language deletes them. Nothing is saved while signed out.
- **Fallback:** opening an unsaved page offline shows `/offline`. It's a static page in every language that lists what's saved on the device.
- **Starting fresh:** bump `VERSION` and the cache names in `sw-rules.js` to discard every saved page and asset on the next visit.
- **Lockdown Mode:** Safari turns service workers off in Lockdown Mode, so offline reading and push reminders don't work there.

## Adding a language

Using Portuguese (`pt`) as the example:

1. **Registry:** add `"pt"` to `LOCALES` and an entry to `LOCALE_INFO` in `src/lib/i18n/locales.ts`: native name, English name, and `dir` (`"rtl"` for Arabic, Hebrew and similar).
2. **Interface text:** copy `src/lib/i18n/messages/en/` to `messages/pt/`, type each file from its English counterpart (see `messages/de/` for the pattern), translate it, and add `pt` to `dictionaries` in `src/lib/i18n/dictionaries.ts`. That is the step that switches the language on in the pickers.
3. **Glossary:** write `.scratch/multilingual/glossary/pt.md` before translating, and add the key terms under Admin → Translations → Glossary once deployed.
4. **Database:** add a migration that widens `profiles_preferred_language_check` (see `0038_profile_locales.sql`) and `is_translation_locale()` (see `0039_content_localizations.sql`) to include `'pt'`. Apply it **before** deploying the code.
5. **AI drafting:** add the language's standard public-domain Bible tradition to `BIBLE_TRADITION` in `src/lib/localization/translate.ts`, so drafts use familiar vocabulary.
6. **Community prompts:** add `content/community-prompts/pt/<date>.json` for each English prompt.
7. **Fonts:** if the script isn't Latin, add a system-font stack for it in `globals.css`, the way `html:lang(zh-CN)` does.
8. **Check:**
   - `npx tsc --noEmit`, `npm test`, `npm run lint` and `npm run build` all pass.
   - Walk the app at 360px width in the new language. Check welcome, sign-in, Home, a journey day, the devotion, Prayer Room, Community and Profile, and look for overflowing or truncated text.
   - For an RTL language, check that the layout and arrows are mirrored.

Removing a language is the reverse. Readers who had chosen it fall back to English, and their saved choice in the database stays valid until the check constraint changes.

## Tests

- `src/lib/i18n/negotiate.test.ts`: matching the browser's language (regional variants, quality values, Traditional Chinese devices offered Simplified, unsupported → none).
- `src/lib/i18n/format.test.ts`: plurals, dates and numbers per language.
- `src/lib/localization/overlay.test.ts`: a translation replaces the whole item or nothing, and anything missing falls back to English.
- `src/lib/content/community-prompt.test.ts`: daily prompts per language, with the English fallback.
- `src/lib/offline/sw-rules.test.ts`: which pages are saved offline, and when saved pages are discarded.
- Type-level: every language must have every key, or `tsc` fails.
