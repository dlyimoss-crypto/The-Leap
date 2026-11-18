# Interface wording to check (Phase 2)

Each language's chosen theological and app terms are in `glossary/<locale>.md`.

# Swahili

Written by AI. Interface text ships without formal approval (decision K3), but these are the phrases the translators were least sure of. Edit them in `src/lib/i18n/messages/sw/<area>.ts`.

## Safety-critical (please check first): `community.ts` → `crisisBanner`
- "Huhitaji kupitia hali hii peke yako. Ikiwa uko katika hatari ya haraka au unawaza kujidhuru, tafadhali tafuta msaada mara moja."
- Link: "Pata msaada wa dharura katika nchi yako →"
- "Unaweza pia kuwasiliana na mtu unayemwamini, kanisa lililo karibu nawe, mshauri wa kitaalamu, au huduma ya dharura."

## Movements and the Formation Loop
- CONNECT "I belong." → "Nina mahali hapa." (alternative: "Mimi ni sehemu ya familia")
- EVOLVE "I am becoming." → "Ninakua."
- Message → "Ujumbe", Explore → "Chunguza", Reflect → "Tafakari", Pray → "Omba", Next Step → "Hatua Inayofuata", Engage → "Shiriki"
- "Multiply — …" → "Zidisha — …"

## Prayer and Community
- "Prayed" → "Umeomba", "I have prayed" → "Nimeomba"
- Prayer request → "hitaji la maombi", Requests tab → "Mahitaji"
- Status badges: wazi / limejibiwa / limefichwa / limeondolewa
- Public → "Wazi", Identified → "Kwa jina", Anonymous → "Bila jina"
- 14 rotating post prompts (free translations)

## Commit, Evolve, Books
- "Mark as kept" → "Thibitisha kuwa imetimizwa"
- "Study 5 paragraphs of the Bible" → "Jifunze aya 5 za Biblia" ("aya" also means verse)
- "~{n} members" → "Takriban washiriki {n}"
- Devotion "Practice" → "Matendo"
- "Books & Literature" → "Vitabu na Maandishi", Library → "Maktaba", manuscript → "Mswada"
- Unpublished → "Imeondolewa" (literally "removed")
- "public domain" → "mali ya umma"

## Engage, Ask PD
- "Mobile Pesa" → "Pesa kwa Simu"
- "US Tax-Deductible Giving" → "Utoaji Unaopunguza Kodi Marekani"
- "Mark handled" / "Mark as seen" → "Weka kuwa imeshughulikiwa" / "Weka kuwa imeonwa"
- "6pm, EAT" → "baada ya saa 12, EAT"

## Admin (team-only)
- Moderation queue → "Foleni ya udhibiti", Unpublish → "Ondoa uchapishaji", Archive → "Hifadhi kumbukumbu"
- Active announcement → "Hewani", Advert → "Tangazo la kibiashara", Card teaser → "Kionjo cha kadi"
- "Decisions for Christ" → "Maamuzi ya kumfuata Kristo"
- Prayer-point and journey-day suggestion chips are translated, so a Swahili-speaking admin who clicks one inserts Swahili text into the content.

# German, French, Spanish, Chinese: highest priority

Files: `src/lib/i18n/messages/<de|fr|es|zh-CN|zh-TW>/`. For each language, please have a native speaker check:

1. **Crisis banner** (`community.ts → crisisBanner`, also Ask PD and Companion crisis text).
2. **Sinner's prayer** (`core.ts → gospelInvite.prayerText`). German and Traditional Chinese capitalise/honour God ("Du/Dich", 祢); Simplified Chinese uses 你.
3. **John 14:6** (`core.ts → gospelInvite.scriptureQuote`): quoted from the public-domain edition, not AI-translated. Check against print:
   - de (Luther 1912): "Ich bin der Weg und die Wahrheit und das Leben." (Johannes 14,6)
   - fr (Louis Segond 1910): "Je suis le chemin, la vérité, et la vie." (Jean 14:6)
   - es (Reina-Valera 1909): "Yo soy el camino, y la verdad, y la vida." (Juan 14:6)
   - zh-CN / zh-TW (和合本): 我就是道路、真理、生命。(约翰福音 / 約翰福音 14:6)
4. **Movement names** (nav tabs):

| | Connect | Commit | Evolve | Engage | Multiply |
|---|---|---|---|---|---|
| de | Verbinden | Entscheiden | Wachsen | Wirken | Weitergeben |
| fr | Communion | S'engager | Grandir | Agir | Multiplier |
| es | Conecta | Compromiso | Crece | Participa | Multiplica |
| zh-CN | 连结 | 委身 | 成长 | 参与 | 倍增 |
| zh-TW | 連結 | 委身 | 成長 | 參與 | 倍增 |

   French "Communion" can suggest the Lord's Supper (alternative: "Lien"). German "Entscheiden" is the least settled.

## Other notes from the translators
- **Gendered words.** Spanish and French default to masculine forms ("Bienvenido", "seul", "bloqué").
- **"AI" vs "IA".** Spanish and French now use "IA", which is how readers in those languages say it.
- **Chinese spacing.** Chinese puts a half-width space between Chinese and Latin text ("Leap 同行者").
- **Bible references in examples.** Search hints and admin examples keep English book names ("John 3:16"), because Scripture search only understands English book names. Swahili admin examples translated them (Mithali, Zaburi…), which is inconsistent.
- **"{count} prayed".** This is a single string, so the translations word around it ("Gebetet: {count}", "Oraron: {count}").
