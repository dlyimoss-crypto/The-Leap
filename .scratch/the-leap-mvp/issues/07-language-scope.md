Type: grilling
Status: resolved

## Question

The target language set is now English, Swahili, French, German, and Chinese (five, per ticket 02's resolution). Ticket 02 already settled the *architecture* question: formation content is content-as-code in per-language directories (`content/<lang>/...`), so adding a language later is a directory addition, not a migration — no further data-model decision needed here.

What's left is purely a **launch-scope** question: does V1 ship with formation content actually translated into all five languages, or does it launch English-only with the file structure ready to receive the other four, deferring the translation work itself (which is real, ongoing effort — someone has to translate and theologically review five languages' worth of devotional content) to post-launch?

## Answer

**English-only for V1.** The "Faith in Christ" 7-day journey — all of its Scripture, Explore, Reflect, Pray, Practice, and Connect content per session — ships in English only. Swahili, French, German, and Chinese are content additions against the already-ready per-language directory structure (ticket 02), not a rebuild, and become the first thing to add once the English MVP validates the core formation loop.
