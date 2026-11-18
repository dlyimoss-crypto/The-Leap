# Phase 2b — translating the interface into a new language: rules

The Leap is a Christ-centred discipleship app ("Your Essential Companion in Christ"). Read `CONTEXT.md` for domain vocabulary and tone. All interface text lives in `src/lib/i18n/messages/en/*.ts` (English = source of truth) and is already translated to Swahili in `messages/sw/` (useful as a second reference for structure, plural handling and what is deliberately left untranslated).

## Your output

1. `src/lib/i18n/messages/<locale>/` with **exactly the same files as `messages/sw/`**: `core.ts`, `common.ts`, `commit.ts`, `evolve.ts`, `books.ts`, `community.ts`, `engage.ts`, `admin.ts`, `index.ts`.
   - Mirror the sw files' imports and type annotations (e.g. `export const commit: CommitMessages = {…}`, `core: CoreMessages`, and in `index.ts` `export const <var>: Dictionary = { ...core, common, … }` where `<var>` is a valid identifier, e.g. `de`, `fr`, `es`, `zhCN`, `zhTW`).
   - Every key present; same shape; same `{placeholder}` names; same function signatures. Plural form objects must include the forms your language needs per `Intl.PluralRules` (always include `other`; Chinese uses only `other`; French `one` covers 0 and 1).
2. `.scratch/multilingual/glossary/<locale>.md`: a short table of the terms you chose for: the four movements (Connect/Commit/Evolve/Engage) and Multiply, Formation Journey, Session, Formation Loop steps (Scripture, Message, Explore, Reflect, Pray, Next Step, Engage), Daily Devotion, Practice, Commitment, Prayer Room, Prayer Request, Testimony, Community, Announcement, Leap Companion; and theological terms: grace, salvation, redemption, righteousness, sanctification, repentance, faith, the Holy Spirit, the Kingdom of God, abiding in Christ, spiritual maturity, discipleship, Lord, Saviour, gospel, sin, forgiveness, eternal life. One line of rationale where the choice isn't obvious. This becomes the seed of the theological glossary reviewers maintain.

**Do not** edit `src/lib/i18n/dictionaries.ts`, `messages/en/*`, `messages/sw/*`, or any other file. The coordinator switches your language on. Don't run state-changing git commands, `next dev` or `next build`.

## Translation rules

- **Meaning over words.** Natural, warm, plain-language interface copy a native speaker would expect from a well-made app. Preserve the tone: encouraging, personal, never preachy or salesy.
- **Theological fidelity.** Use the established Christian vocabulary of your language's mainstream Protestant/evangelical tradition (the tradition behind the standard public-domain Bible in that language: Luther for German, Louis Segond for French, Reina-Valera for Spanish, the Chinese Union Version 和合本 for Chinese). Don't introduce new theological nuance or soften/strengthen claims.
- **Address form.** Choose the register an evangelical discipleship app would use and apply it consistently: German informal "du"; French "tu"; Spanish informal "tú"; Chinese "你" (not 您) except where the English is formal.
- **Never translate:** "The Leap", "Leap Companion" is translated as a name only if Swahili did (it did: follow the same principle — the brand word "Leap" stays, "Companion" may be translated), "Ask PD", "Pastor Deniss" (title may be localized: Pastor/Pasteur/Pastor/牧师/牧師), "PD team" ("PD" stays), "AI", "WhatsApp", URLs, email addresses, `{placeholders}`, "Berean Standard Bible (BSB)", Bible book names and references (keep them exactly as in English, e.g. "John 3:16"), "EAT" time zone, "US$"/"$" amounts.
- **Scripture in the interface.** Only `core.ts → gospelInvite.scriptureQuote` / `scriptureRef` quote the Bible. Use the exact wording of your language's standard public-domain edition named above for John 14:6 (do not paraphrase or AI-translate it), and localize the reference's book name for that quote only (e.g. "Johannes 14,6", "Jean 14:6", "Juan 14:6", "约翰福音 14:6", "約翰福音 14:6"). Flag it in your report.
- **The sinner's prayer** (`gospelInvite.prayerText`): translate faithfully and reverently in natural prayer language; flag it for review.
- **Crisis banner** (`community.ts → crisisBanner`): safety-critical, translate with care; keep the link text meaning "find urgent support in your country".
- **Length.** Buttons, tabs and nav labels must stay short: aim for no more than about 1.3× the English length for button/tab/nav strings; pick a shorter natural synonym rather than a long literal one. German: avoid very long compounds in buttons where a shorter word exists.
- **Chinese specifics.** zh-CN in Simplified characters with mainland conventions; zh-TW in Traditional characters with Taiwan conventions (not just character conversion: e.g. 信息 vs 訊息, 视频 vs 影片, 设置 vs 設定). Use full-width punctuation （，。？！：） inside Chinese text, and no spaces between Chinese characters. Numbers stay as Arabic numerals.
- **Typographic conventions.** French: non-breaking space before ? ! : ; and « guillemets » where English uses quotes. German: „…" quotes. Spanish: ¿…? and ¡…!. Keep "…" (ellipsis) in loading states.
- **Dates/numbers** come from Intl helpers, not from your strings: don't hardcode formats.

## Done means

- `npx tsc --noEmit` has no errors in your files (the build fails on any missing key or wrong shape).
- `npx eslint src/lib/i18n/messages/<locale>` clean.
- You checked each file against its English counterpart key by key.

## Report back (concise)

- Files written, glossary path.
- Register choice.
- Strings you're least sure of (especially gospelInvite prayer/quote, crisis banner, movement names, Formation Loop labels), with the English.
- Any English string that seemed wrong or ambiguous in the source.
