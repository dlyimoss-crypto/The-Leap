# Localization: in-house dictionaries, per-type translation tables, admin-approved content

The Leap needed to serve readers in Kiswahili, German, French, Spanish and Simplified Chinese as well as English, without risking the integrity of its teaching, without leaking half-translated screens, and without disturbing anyone's progress.

**Interface text** stays in the app's own typed dictionaries (`src/lib/i18n/messages/<locale>/`), chosen on the server for each request. English is the type source, so a missing key is a compile error rather than a stray English string. We considered `next-intl`, but rejected it: the existing pattern already fits React Server Components, and switching would have meant rewiring every call site for little gain. Interface text ships without formal approval (it's corrected as native speakers report issues).

**The reader's language** comes from their profile when signed in, otherwise from a cookie set by a language picker, otherwise English. The device language is only ever *offered*, never applied silently, and geography is never used. URLs have no `/de/` prefixes. The app is mostly behind sign-in, and prefixes would have touched every route for no SEO benefit.

**Teaching content** (journeys, journey days, devotions, announcements) is translated into one sibling table per content type (`journey_localizations` and so on). We chose these over a generic JSON table so each keeps real columns, constraints and row-level security. English source rows are never written by the translation path.

Readers only ever see `published` translations, which RLS enforces, not just the UI. A translation missing a part the English has is held back for an admin, not published. A translation is shown all-or-nothing: if an item isn't published in the reader's language, the whole item is shown in English with a notice, never a mix of languages within one devotion. Each source row's `content_version` goes up when its text changes, so an older translation shows as *outdated*. It is still served (a slightly old translation beats none) until it's translated again, which happens automatically the next time the English is saved.

**AI translates and publishes automatically.** Claude translates server-side, using each language's glossary of approved theological terms, whenever an admin saves English content, and the translation goes live straight away. We first built it with admin review before publishing; on 2026-11-19 the review step was dropped, because readers should simply get their language when they choose it. That trades a native-speaker check for translations being available immediately. Admins correct translations afterwards in Admin → Translations. When the English changes, the item is translated afresh, which replaces hand corrections; keeping corrections would mean translations quietly drifting from a changed original. Any admin can correct. Every status change is logged by a database trigger.

**Out of scope by decision:**
- Bible translations: Scripture stays the Berean Standard Bible in every language. Machine-translating Scripture was never an option, and licensed editions weren't wanted yet.
- Books.
- People's own words (posts, prayer requests, reflections, Ask PD).
- Traditional Chinese, dropped for now (re-adding it is a dictionary folder, a registry entry and a migration).

**Offline reading** came with this work. It's network-first caching of pages the reader has already opened, scoped to one signed-in reader and language, and discarded on sign-out, an account switch or a language change. Network-first means progress is never shown stale while online, and the scoping means a shared phone never shows the previous reader's pages.
