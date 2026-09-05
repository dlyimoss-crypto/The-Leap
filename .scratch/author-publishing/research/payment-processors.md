# Payment Processor for Book Purchases — Options Research (Sept 2026)

Founder/business entity: **Tanzania**. V1 scope per ticket 04: one-time purchases only ($1–$20 PDF/EPUB books), Leap+ subscription deferred but architected for. Checkout direction locked per ticket 05: **embedded/hosted, in-app-feeling** (not a jarring full external redirect).

## TL;DR Recommendation

**Primary: Flutterwave.** It is the only candidate in this research where a Tanzania-registered business's ability to both (a) receive payouts and (b) accept East African mobile money is confirmed from the processor's *own* official pages, not inferred from secondary sources. Flutterwave is licensed by the Bank of Tanzania as a Payment Service Provider, publishes Tanzania-specific merchant help-center pages, documents Tanzania mobile money collection (Airtel Money confirmed by name in its own API docs) in its developer docs, ships an official Node.js SDK, offers a hosted/inline JS checkout modal that fits the locked "embedded, in-app-feeling" direction, has a documented Refund API, and has a "Payment Plans" feature that could carry Leap+ later without a rebuild. It is a plain payment gateway (not a merchant of record), so The Leap remains the seller of record for its own tax compliance — acceptable at this transaction volume/geography.

**Genuine gap, and how to bridge it:** Flutterwave's Tanzania operation is newer and thinner on public documentation than its Nigeria/Kenya/Ghana business, and none of the mobile-money-native local players (Selcom, AzamPay, Pesapal, DPO) offer a modern embeddable JS checkout + official Node SDK combination as clean as Flutterwave's — so if Flutterwave's Tanzania KYC/onboarding proves slow or unreliable in practice, **Pesapal** is the strongest backup (transparent published 3.5% fee, multi-country East African regulator coverage including Tanzania, documented API/plugins) and **Selcom** the strongest fallback if you want the account fully domiciled in a Tanzania-headquartered company. Two of the internationally popular "easy button" options that show up in every founder's shortlist — **Stripe** and **Paystack** — are confirmed *not usable at all* for a Tanzania-based seller (no payout path exists), and **PayPal**, while nominally "available" in Tanzania, is documented (via community/secondary reports, not PayPal's own page — see PayPal notes) to block businesses registered in Tanzania from *receiving* money at all. Two merchant-of-record options — **Paddle** and **Lemon Squeezy** — do have primary-source-confirmed Tanzania payout eligibility (a genuinely useful, underrated finding of this research), but neither has any East African mobile money acceptance, so they only ever solve half the problem (founder payout) and not the other half (local buyer payment method).

**On the manual mobile-money/QR fallback (added scope):** Tanzania has a Bank-of-Tanzania-mandated national QR standard (**TAN-QR**, 2022 circular) that is explicitly designed for interoperability across banks and mobile network operators — so a manual "pay to a lipa-namba/till number or bank account, then submit a transaction reference for admin verification" flow is technically realistic and not provider-specific. But it introduces a real UX regression (no instant unlock — a human has to verify before the download unlocks) and doesn't serve card-paying/international buyers at all. **Recommendation: don't make it V1's primary path.** Build Flutterwave as the automated processor first (it already covers both TZ payout and TZ mobile money in one integration). Keep the manual QR/reference flow in your back pocket only as a stopgap if Flutterwave's Tanzania merchant KYC takes longer than expected to clear before launch — not as a permanent parallel checkout path, since manual admin verification doesn't scale past a handful of sales a day and duplicates work the automated processor already does correctly.

---

## 1. Comparison Table

| Processor | Tanzania payout support (founder) | Mobile money (local buyers) | Fees | MoR vs. gateway | Checkout fit (embedded/hosted, in-app feel) | Digital delivery | Subscription-ready (Leap+) |
|---|---|---|---|---|---|---|---|
| **Stripe** | **No** — Tanzania absent from Stripe's own supported-countries list; the Paystack "extended network" only covers Ghana, Kenya, Nigeria, South Africa, Côte d'Ivoire | No East African mobile money | 2.9% + $0.30 (US baseline) — moot, can't onboard | Gateway | Best-in-class: Stripe Checkout / Embedded Checkout, official Node SDK, first-class Next.js docs | No native — build via webhook | Excellent (native Subscriptions API) — moot without payout |
| **PayPal** | Listed as an available *country*, but multiple non-PayPal reports say TZ-registered businesses can only **send**, not **receive** — could not confirm this specific restriction on PayPal's own page (see notes) | No mobile money, cards/PayPal balance only | 3.49% + $0.49 (checkout, US) + 1.5% international | Gateway | PayPal Smart Buttons overlay — workable, feels less "native" than Stripe | No native | Subscriptions API exists — moot if receiving is blocked |
| **Paddle** | **Yes** — Paddle's own help center lists ~28 unsupported countries (sanctioned/high-risk); Tanzania is not among them | **No** — card/wallet/PayPal-based checkout only, no East African mobile money | 5% + $0.50 flat, all-in | **Merchant of Record** (handles global sales tax/VAT) | Overlay + inline JS checkout, official Node SDK, decent Next.js guides | Not native to Paddle Billing — build via webhook | Native, in fact its core product |
| **Lemon Squeezy** | **Yes** — official docs list Tanzania under "Bank payouts supported countries" (confirmed directly, see notes) | **No** — no East African mobile money | 5% + $0.50 (+1.5% intl/PayPal, +0.5% subscriptions) | **Merchant of Record** | Lemon.js checkout overlay, documented API, Next.js-friendly | Native digital-product delivery | Native, first-class subscriptions |
| **Gumroad** | **Unconfirmed** — Gumroad's own country-support help article could not be retrieved (login-gated to automated fetches) in this research pass; secondary lists of newly-added payout countries (2025–26) do not include Tanzania | No mobile money | 10% + $0.50 (direct) since becoming MoR; historically variable | Became a **Merchant of Record** (Jan 2025) | Simple overlay/embed widget, but thin developer/API docs vs. Stripe/Paddle | Native — purpose-built for digital downloads | No dedicated subscription product marketed |
| **Selar** | **Yes** — Selar's own pricing/help pages list TZS as a supported settlement currency and give a TZS payout timeline (funds in 4 days) | **Yes** — confirmed by Selar's own official account: Tanzanian buyers can pay via mobile money | ~4% + small fixed fee (published for NGN; "varies by currency" for others incl. TZS, exact TZS number not published) | Functions as a gateway/creator platform, not a marketed MoR | Hosted product page + embeddable widget — not a true JS overlay/SDK; thin formal developer API | Native — purpose-built for ebook/PDF delivery | Some membership/subscription capability exists in-product, not formally documented as an API |
| **Flutterwave** | **Yes** — Bank-of-Tanzania-licensed PSP; Flutterwave's own blog and Tanzania-specific help-center pages confirm Tanzanian businesses can sign up and be settled locally | **Yes** — Tanzania mobile money documented in Flutterwave's own developer docs (Airtel Money named explicitly) | Cards: 3.5% local / 4.8% international; mobile money: tiered flat fee below ~50,000 TZS, 2.5% above | Gateway (Leap is seller of record) | Standard/Inline JS checkout modal, official Node SDK, documented Refund API | Not native — build via webhook (same as Stripe) | "Payment Plans" feature for recurring billing exists |
| **Paystack** | **No** — Paystack's own country page and merchant materials list only Nigeria, Ghana, South Africa, Kenya, Côte d'Ivoire | N/A (not onboardable) | N/A | Gateway | N/A | N/A | N/A |
| **DPO Group (Network International)** | **Yes** — registered in-country as One Payment Tanzania Ltd, Bank-of-Tanzania-acknowledged PSP, offices in Dar es Salaam/Arusha/Zanzibar | **Yes** — Tigo Pesa, Vodacom M-Pesa, Airtel Money named on DPO's own Tanzania page | Not publicly published — negotiated per merchant, sales-led onboarding | Gateway | Hosted payment page + API; no official Node SDK found, enterprise-style integration | Not native | Not clearly marketed |
| **Selcom** | **Yes** — Tanzania-headquartered fintech; built for local settlement to bank accounts and mobile wallets | **Yes** — Airtel Money, Mixx by Yas, M-Pesa, T-Pesa, HaloPesa, Azam Pesa, plus TanQR/Till, per Selcom's own site | Not publicly published — sales-led | Gateway | Developer API exists but thin public/English docs; no confirmed Node SDK or JS overlay | Not built for digital goods — general payments infra | Not marketed as a subscription product |
| **AzamPay** | **Yes** — Tanzania-native (Azam Group), built as "the payment rails of East Africa" | **Yes** — AzamPesa, Tigo Pesa, HaloPesa, Airtel Money per AzamPay's own product page | Marketed as "no hidden fees," volume discounts >TZS 100M/month — no public percentage | Gateway | REST API (mobileCheckout/bankCheckout) with sandbox portal; no official Node SDK found (third-party Dart/Go clients exist) | Not native | Not clearly marketed |
| **Pesapal** | **Yes** — regulated by the Central Banks of Kenya, Uganda, Tanzania, Rwanda, Zambia; dedicated Tanzania business site | **Yes** — general mobile money support, explicitly optimized for M-Pesa-style East African wallets | 3.5% per transaction, published | Gateway | Payment Link (no-code) + API/plugins, documented at developer.pesapal.com; no confirmed official Node SDK | Not native | Not clearly marketed |

---

## 2. Notes per provider

### Stripe
- Stripe's own global-availability page does **not** list Tanzania among supported countries/regions. [Stripe global availability](https://stripe.com/global)
- Stripe's "extended network" via its 2020 Paystack acquisition covers only Ghana, Kenya, Nigeria, South Africa, and Côte d'Ivoire — Tanzania is not part of it. [Receive payouts | Stripe Docs](https://docs.stripe.com/payouts)
- No East African mobile money acceptance is documented anywhere in Stripe's payment-methods docs.
- Verdict: not usable for a Tanzania-domiciled seller without incorporating a business in a supported country (e.g. via Stripe Atlas in the US) — a real workaround some African founders use, but it changes the business's legal/tax domicile and is out of scope for "the founder/business entity is based in Tanzania" as given.

### PayPal
- PayPal's own country page for Tanzania exists at [paypal.com/tz/webapps/mpp/country-worldwide](https://www.paypal.com/tz/webapps/mpp/country-worldwide), confirming Tanzania is a listed country in PayPal's system, but repeated attempts in this research to retrieve the page's actual body content (not just its title) were unsuccessful — the page appears to render its country/currency detail client-side in a way this research's fetch tooling could not extract.
- Multiple non-PayPal sources — a PayPal Community user thread and a Tanzanian fintech's own explainer — report that Tanzania-registered PayPal accounts can send but not receive payments, i.e. no way to accept customer payments as a business. [PayPal in Tanzania — PayPal Community](https://www.paypal-community.com/t5/Products-Services/PayPal-in-Tanzania/td-p/3108553), [Alternatives to PayPal in Tanzania — ClickPesa](https://clickpesa.com/paypal-in-tanzania/)
- **No primary-source confirmation found as of research date** for this specific receive-restriction directly on paypal.com. Given the strength and consistency of independent secondary/community reports, and the complete absence of a Tanzania-specific PayPal Business fee schedule anywhere in PayPal's own materials, this research treats PayPal as effectively non-viable for The Leap's founder to receive payouts — but flags that this is not a page-in-hand primary-source claim the way the Flutterwave/Paddle/Lemon Squeezy/Selar findings are.
- No mobile money support in any market — card and PayPal-balance only.

### Paddle
- Paddle's own Help Center article "Which countries are supported by Paddle?" states Paddle "works with software businesses anywhere in the world with the exception of the unsupported countries listed below," and the listed unsupported set is a ~28-country sanctions/high-risk list (Afghanistan, Belarus, Cuba, Iran, North Korea, Russia, Somalia, Sudan, Syria, Zimbabwe, etc.) — **Tanzania is not on it**, meaning Tanzania is a supported seller country per Paddle's own page. [Which countries are supported by Paddle? — Paddle Help Center](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle)
- Note: a third-party aggregator (supportedcountries.com) lists a *different*, shorter set of "supported" African countries that excludes Tanzania — this research treats Paddle's own help-center page as authoritative over that aggregator, per the instruction to prefer primary sources, but flags the discrepancy for the founder to double-check by actually starting Paddle's own signup flow before committing.
- Paddle is an explicit **Merchant of Record**: it "automatically calculates taxes, handles compliance" for sales into 200+ countries. [Supported countries — Paddle Developer Docs](https://developer.paddle.com/concepts/sell/supported-countries-locales/)
- Pricing is a flat 5% + $0.50 per transaction with no regional variation disclosed. On a $1–$3 book, the $0.50 fixed component alone is 15–50% of the sale — a meaningful problem given The Leap's stated $1–$20 price range skews toward the cheap end.
- No East African mobile money support found anywhere in Paddle's payment-methods documentation — Paddle's checkout methods are card/wallet/PayPal-class only.
- Checkout: offers both an "overlay" (a few lines of JS) and a "branded inline" checkout, both PCI/tax/compliance-handled, with a documented Node integration path. [Build an overlay checkout — Paddle Developer](https://developer.paddle.com/build/checkout/build-overlay-checkout), [Build inline checkout — Paddle Developer](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)
- Refunds: Paddle fires a `subscription_payment_refunded` webhook event and documents full/partial refund handling. [Paddle Developer changelog](https://developer.paddle.com/changelog/overview)

### Lemon Squeezy
- Lemon Squeezy's own documentation page, "Docs: Supported Countries," lists **Tanzania explicitly** under its "Bank payouts supported countries" list (confirmed alphabetically between Thailand and Trinidad and Tobago in the page's own text). [Docs: Supported Countries — Lemon Squeezy](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
- Lemon Squeezy is a **Merchant of Record**, handling global tax/VAT compliance on the seller's behalf. [Lemon Squeezy homepage](https://www.lemonsqueezy.com/)
- Fees: 5% + $0.50 base, +1.5% for international cards/PayPal, +0.5% for subscription payments — same "$0.50 hurts on cheap items" problem as Paddle for a $1 book.
- No East African mobile money support found in its payments/currency docs — card, PayPal, and a defined set of local payment methods only, none of them East African mobile wallets.
- Checkout: Lemon.js provides an overlay checkout ("Opening Overlays with Lemon.js") that loads over the current page — fits the locked "embedded/hosted, in-app-feeling" direction well, with a documented Checkout API/object. [Docs: Opening Overlays with Lemon.js](https://docs.lemonsqueezy.com/help/lemonjs/opening-overlays), [API Docs: The Checkout Object](https://docs.lemonsqueezy.com/api/checkouts/the-checkout-object)
- Refunds and subscriptions are both documented first-class API/dashboard features. [Guides: Taking Payments](https://docs.lemonsqueezy.com/guides/developer-guide/taking-payments)
- Overall: genuinely the strongest MoR option on Tanzania-payout eligibility grounds (confirmed directly from its own docs) — its only real weakness for The Leap is the complete lack of East African mobile money acceptance and the $0.50 flat fee eating a large share of a $1–$3 book sale.

### Gumroad
- Gumroad became a Merchant of Record as of January 1, 2025, per its own blog: "Gumroad is becoming a Merchant of Record." [Gumroad blog](https://gumroad.com/blog/p/gumroad-is-becoming-a-merchant-of-record-more-updates)
- **Tanzania payout status: unconfirmed.** Gumroad's own "Can I Use Gumroad in My Country?" help article ([help.gumroad.com/article/152](https://help.gumroad.com/article/152-can-i-use-gumroad-in-my-country)) could not be retrieved in this research — both a direct fetch and a fetch via a text-extraction proxy returned only Gumroad's help-center login wall, not the article body, for reasons this research could not work around.
- Secondary evidence is suggestive but not conclusive: Gumroad's own official X/Twitter account has posted several "new payout countries" announcements through 2025–26 (Norway, Liechtenstein, Gibraltar, Malaysia, Kazakhstan, Ecuador, Uruguay, Mauritius, Jamaica, Bosnia & Herzegovina, Nigeria, Bahrain, Jordan, Albania, Dominican Republic, Uzbekistan, Bolivia, Armenia) — Tanzania does not appear in any of the lists surfaced by this research, which is weak evidence *against* current support but not a confirmed exclusion. [Gumroad on X](https://x.com/gumroad/status/1856525514275803638)
- **No primary-source confirmation found either way as of research date.** Do not treat Gumroad as a settled "no" — a founder-side signup attempt would resolve this in minutes and is worth doing before ruling it out, but it cannot be recommended as V1's processor without that confirmation.
- No East African mobile money support found regardless.

### Selar
- Selar's own pricing page lists Tanzanian Shilling (TZS) as one of 14 supported settlement currencies, alongside NGN, USD, GBP, GHS, KES, ZAR, UGX, RWF, XAF, XOF, ZMW, SLE. [Selar Pricing](https://selar.com/pricing)
- Selar's own help center gives a TZS-specific payout timeline: "Tanzanian Shilling (TZS) — Payout Time: Funds are available 4 days after the sale." [Payment Timelines on Selar](https://help.selar.com/portal/en/kb/articles/payment-timelines-on-selar)
- Selar's own official X/Twitter account states directly: "We actually already support mobile money for Ghana, Kenya & Tanzania... Tanzanians can pay via mobile money too. All of these options are enabled by default for all cr[eators]." [Selar on X](https://x.com/tryselar/status/1435116484905390082)
- Fees: 4% + a small fixed fee, explicitly stated to vary by currency (only the NGN figure — 4% + ₦50 — is published in detail; the TZS-specific fixed component was not found published). [Selar Pricing](https://selar.com/pricing)
- Digital delivery is Selar's core purpose: sellers upload a PDF, buyers get instant download access via email/receipt page, with an optional "Read Online" mode instead of download. [How To Sell Your Ebook Online Using Selar — Selar Blog](https://selar.com/blog/how-to-sell-your-ebook-online-using-selar/)
- Checkout integration shape is the weak point relative to ticket 05's "embedded/hosted, in-app-feeling" requirement: Selar offers a hosted product page and an embeddable widget for sites like WordPress, but this research found no formal REST/Node SDK documentation comparable to Stripe/Paddle/Lemon Squeezy/Flutterwave — Selar reads as a no-code creator storefront more than a developer-integrable payment infrastructure, which matters if The Leap wants full control over the purchase flow inside its own Next.js app rather than linking out to a Selar-hosted page.
- Not marketed as a Merchant of Record; behaves as a payment-collecting creator platform.

### Flutterwave
- Flutterwave's own blog confirms Bank-of-Tanzania regulatory approval and open merchant signup: "the Bank of Tanzania approved our license as a payment service provider" and "Tanzanian businesses who sign up as Flutterwave merchants will get a chance to have their stories told to the world." [Flutterwave is now Live in Tanzania](https://flutterwave.com/rw/blog/flutterwave-is-now-live-in-tanzania)
- Flutterwave maintains a Tanzania-specific help-center namespace (e.g. `flutterwave.com/tz/support/...`), and its developer docs include a dedicated Tanzania page confirming mobile money collection support (Airtel named explicitly in the sample API payload). [Flutterwave Tanzania developer docs](https://developer.flutterwave.com/v3.0/docs/tanzania)
- Fees for Tanzania: cards 3.5% (local) / 4.8% (international); mobile money uses a tiered flat fee below ~20,000–50,000 TZS and 2.5% above that threshold; payouts via mobile money 500 TZS below 40,000 TZS or 1.55% above, bank transfer payouts 3,000 TZS flat.
- Refunds are a documented, first-class API: `POST /v3/transactions/{id}/refund`, supporting full or partial refunds with comments. [Refunds — Flutterwave Developer Docs](https://developer.flutterwave.com/docs/refunds)
- Checkout: "Flutterwave Standard" is a hosted/redirect-based checkout page; an inline/modal JS option is also documented, and an official Node.js SDK exists (`flutterwave-node-v3`) alongside SDKs for Python, PHP, Ruby, Go, Java. [Flutterwave Standard — Developer Docs](https://developer.flutterwave.com/v3.0/docs/flutterwave-standard-1), [Node-v3 SDK — GitHub](https://github.com/Flutterwave/Node-v3)
- A "Payment Plans" feature exists for recurring billing, which is the clearest path in this whole comparison to adding Leap+ later without switching processors.
- Is a plain payment gateway, not a Merchant of Record — The Leap remains responsible for its own tax/VAT compliance globally, which for a small, mostly-African-buyer, sub-$20-ticket V1 product is a manageable tradeoff against Paddle/Lemon Squeezy's ~5%+$0.50 MoR premium.
- Caveat: Flutterwave's Tanzania business is newer and thinner in public-facing detail than its flagship Nigeria/Kenya/Ghana operations (fewer country-specific help articles were found, and several developer-doc pages for Tanzania returned partial or 404 results during this research) — worth a real signup/KYC test before committing, not just a docs read.

### Paystack
- Paystack's own countries page and merchant-facing materials consistently list five supported countries: Nigeria, Ghana, South Africa, Kenya, and Côte d'Ivoire. [Paystack Countries](https://paystack.com/countries)
- Tanzania is not among them, and no East African mobile money coverage for Tanzania exists on Paystack as a result. Not viable for this use case; included for completeness since the founder's brief specifically asked for it to be checked given Stripe's ownership of Paystack.

### DPO Group (Network International) / "DPO Pay by Network"
- DPO operates in Tanzania under a locally registered entity, One Payment Tanzania Limited, and the Bank of Tanzania has formally acknowledged DPO Pay as a licensed Payment Service Provider. [The Bank of Tanzania acknowledges DPO Pay as a licensed PSP](https://dpogroup.com/blog/the-bank-of-tanzania-acknowledges-dpo-pay-as-a-licensed-psp/)
- DPO's own Tanzania product page confirms mobile money support for Tigo Pesa, Vodacom M-Pesa, and Airtel Money, plus card payments (Visa/Mastercard/Amex/Diners) and bank transfer partnerships with KCB, Equity Bank, and EcoBank, settling in TZS as well as USD/EUR/GBP. [Online Payments Tanzania — DPO Pay](https://dpogroup.com/online-payments/tanzania/)
- DPO has local offices in Dar es Salaam, Arusha, and Zanzibar. [Online Payments Tanzania — DPO Pay](https://dpogroup.com/online-payments/tanzania/)
- No public fee schedule was found; DPO's onboarding is sales-led ("Talk to sales"), and its own VAT explainer confirms fees are customized per merchant/market rather than published as a flat rate. [VAT Regulations For Merchants In Africa & DPO Policy](https://dpogroup.com/vat-regulations-for-merchants-in-africa/)
- No official Node.js SDK or modern JS checkout-overlay product was found in DPO's own developer materials — its integration story reads as more enterprise/agency-oriented (hosted payment page + API) than a self-serve, docs-first developer product, which is a real friction point against the locked "in-app-feeling" checkout direction.

### Selcom
- Selcom is a Tanzania-headquartered payments company, which structurally removes any "is this business allowed to receive payouts here" question — it's a domestic provider by design. [Selcom — Business](https://www.selcom.net/business)
- Selcom's own Selcom Pay product page lists an extensive local mobile-money and QR surface: Airtel Money, Mixx by Yas, M-Pesa, T-Pesa, HaloPesa, and Azam Pesa via USSD, plus card acceptance via its QwikChap POS and pay-by-link via "Till/TanQR." [Selcom Pay](https://www.selcom.net/selcom-pay-)
- A developer API exists at [developers.selcommobile.com](https://developers.selcommobile.com/), but this research found no evidence of an official Node.js SDK, and the public developer documentation reads as thinner/less internationally-facing than Flutterwave's — no digital-goods/file-delivery features are mentioned anywhere on Selcom's own site, meaning The Leap would build 100% of the download-gating and entitlement logic itself, same as with Stripe/Flutterwave.
- No published fee schedule was found; pricing appears to be negotiated directly with Selcom's business team.

### AzamPay
- AzamPay is part of the Azam Group (a large Tanzanian conglomerate) and markets itself explicitly as "the payment rails of East Africa," collecting and disbursing across AzamPesa, Tigo Pesa, HaloPesa, Airtel Money, cards, and banks from one API. [AzamPay](https://azampay.com/), [AzamPay Payment Gateway product page](https://azampay.com/products/payment-gateway)
- Merchant onboarding runs through a developer portal (`developers.azampay.co.tz`) with a sandbox registration flow; production credentials require a signed business agreement. [AzamPay Developers](https://azampay.com/developers)
- Pricing is marketed as "no hidden fees, no setup costs, no monthly minimums," with volume discounts above TZS 100M/month in transaction volume — no public percentage rate was found, meaning real pricing requires a sales conversation.
- No official Node.js SDK was found (third-party Dart/Flutter and Go clients exist on GitHub, built by the community rather than AzamPay itself), and no digital-goods delivery feature exists — same build-it-yourself entitlement story as Flutterwave/Selcom.

### Pesapal
- Pesapal explicitly states it is regulated by the Central Banks of Kenya, Uganda, **Tanzania**, Rwanda, and Zambia, and maintains a dedicated Tanzania business page. [Pesapal Tanzania — Business](https://www.pesapal.com/tz/business/online), [Pesapal Tanzania](https://www.pesapal.com/tz)
- Pesapal's own blog frames its East African focus as enabling "optimised mobile money integration, particularly with M-Pesa support," alongside cards, from a single dashboard. [Payment Gateway in Tanzania: Why Pesapal is Power](https://www.pesapal.com/blog/payment-gateway-in-tanzania-why-pesapal-is-powering-the-future-of-digital-transactions)
- Fees: 3.5% per transaction for online/POS payments, no setup or monthly/maintenance fees — the clearest, most transparently published fee of any East-Africa-native option in this research.
- Integration options include a no-code Online Payment Link, an Online Invoicing tool, and an Integrations API & Plugins path with a separate developer site (`developer.pesapal.com`), which is a reasonably mature self-serve story relative to DPO/Selcom/AzamPay, though no official Node.js SDK was confirmed.
- No digital-goods/file-delivery feature exists — same as the other East African gateways.

---

## 3. A note on the manual mobile-money / QR flow (no processor at all)

**What it would look like:** buyer sees a QR code and/or plain payment details (a mobile-money "lipa namba"/till number, or a bank account number) for the founder's own account, pays directly via their mobile money app or bank, then submits a transaction reference in the app for manual admin verification before the book's download unlocks.

**Is there a shared/interoperable QR standard in Tanzania, or is it provider-specific?** There is a real, national, Bank-of-Tanzania-mandated standard: **TAN-QR** (Tanzania Quick Response Code Standard), established via a 2022 Bank of Tanzania circular that required all financial service providers to align new merchant QR codes with the national standard within six months of the circular's effective date. The explicit purpose, per the Bank of Tanzania's own circular, is interoperability — a single QR code that any customer can scan and pay regardless of which bank or mobile money app they use. [TANQR Code Standard 2022 — Bank of Tanzania circular (PDF)](https://www.bot.go.tz/Publications/Acts,%20Regulations,%20Circulars,%20Guidelines/Circulars/en/2022081908435357.pdf), [Bank of Tanzania — Payment System Initiatives](https://www.bot.go.tz/PaymentSystem/Initiatives). This sits alongside **TIPS** (Tanzania Instant Payment System), the Bank of Tanzania's real-time interoperable payment rail connecting banks and mobile money operators for P2P/P2B/P2M transfers — as of the most recent reporting found, 39 banks and 6 telecoms are integrated with TIPS. [BoT connects all payment providers to TIPS — Daily News](https://dailynews.co.tz/bot-connects-all-payment-providers-to-tips/) In practice, several of the local processors profiled above (Selcom explicitly names "Till/TanQR" as a payment option on its own site) already generate TAN-QR-compliant codes as part of their merchant tooling — so a manual flow could either use a truly ad hoc lipa-namba/till number, or a proper TAN-QR code obtained through a local PSP or bank, with the latter being the more legitimate and trustworthy-looking option for buyers.

**Tradeoffs versus an automated processor:**
- *For:* zero integration engineering, zero payout-eligibility risk (money lands directly in an account the founder already owns and controls in Tanzania), and it matches how many Tanzanian small businesses already take payment day to day.
- *Against:* no instant unlock — a human has to check a transaction reference before the download unlocks, which is a real UX regression against the rest of the app's experience and doesn't scale past a handful of sales a day; serves only local mobile-money/bank-transfer buyers, with zero support for international or card-paying buyers; and it duplicates bookkeeping/reconciliation work that an automated processor's dashboard already does.

**Recommendation:** Don't make this V1's primary or a permanent parallel path — build Flutterwave first, since it already covers both Tanzania payout and Tanzania mobile money acceptance in a single automated integration with instant, no-admin-required download unlocking. Keep the manual QR/reference flow as a documented fallback plan only, to be used temporarily if Flutterwave's Tanzania merchant KYC/onboarding takes longer to clear than the launch timeline allows — not as a standing second checkout option once the automated processor is live.

---

## Sources

- [Stripe global availability](https://stripe.com/global)
- [Receive payouts — Stripe Docs](https://docs.stripe.com/payouts)
- [PayPal Global — Tanzania country page](https://www.paypal.com/tz/webapps/mpp/country-worldwide)
- [PayPal in Tanzania — PayPal Community](https://www.paypal-community.com/t5/Products-Services/PayPal-in-Tanzania/td-p/3108553)
- [Alternatives to PayPal in Tanzania — ClickPesa](https://clickpesa.com/paypal-in-tanzania/)
- [Which countries are supported by Paddle? — Paddle Help Center](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle)
- [Supported countries — Paddle Developer Docs](https://developer.paddle.com/concepts/sell/supported-countries-locales/)
- [Build an overlay checkout — Paddle Developer](https://developer.paddle.com/build/checkout/build-overlay-checkout)
- [Build inline checkout — Paddle Developer](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)
- [Paddle Developer changelog](https://developer.paddle.com/changelog/overview)
- [Docs: Supported Countries — Lemon Squeezy](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
- [Docs: Opening Overlays with Lemon.js — Lemon Squeezy](https://docs.lemonsqueezy.com/help/lemonjs/opening-overlays)
- [API Docs: The Checkout Object — Lemon Squeezy](https://docs.lemonsqueezy.com/api/checkouts/the-checkout-object)
- [Guides: Taking Payments — Lemon Squeezy](https://docs.lemonsqueezy.com/guides/developer-guide/taking-payments)
- [Lemon Squeezy homepage](https://www.lemonsqueezy.com/)
- [Gumroad blog — becoming a Merchant of Record](https://gumroad.com/blog/p/gumroad-is-becoming-a-merchant-of-record-more-updates)
- [Can I Use Gumroad in My Country? — Gumroad Help Center](https://help.gumroad.com/article/152-can-i-use-gumroad-in-my-country) (page could not be retrieved during this research)
- [Gumroad on X — new payout countries](https://x.com/gumroad/status/1856525514275803638)
- [Selar Pricing](https://selar.com/pricing)
- [Payment Timelines on Selar](https://help.selar.com/portal/en/kb/articles/payment-timelines-on-selar)
- [Selar on X — mobile money for Ghana, Kenya, Tanzania](https://x.com/tryselar/status/1435116484905390082)
- [How To Sell Your Ebook Online Using Selar — Selar Blog](https://selar.com/blog/how-to-sell-your-ebook-online-using-selar/)
- [Flutterwave is now Live in Tanzania — Flutterwave Blog](https://flutterwave.com/rw/blog/flutterwave-is-now-live-in-tanzania)
- [Flutterwave Tanzania developer docs](https://developer.flutterwave.com/v3.0/docs/tanzania)
- [Flutterwave Standard checkout — Developer Docs](https://developer.flutterwave.com/v3.0/docs/flutterwave-standard-1)
- [Refunds — Flutterwave Developer Docs](https://developer.flutterwave.com/docs/refunds)
- [Node-v3 SDK — Flutterwave GitHub](https://github.com/Flutterwave/Node-v3)
- [Selecting the correct Flutterwave business account — Flutterwave Help Center](https://flutterwave.com/gb/support/my-account/selecting-the-correct-flutterwave-business-account)
- [Paystack Countries](https://paystack.com/countries)
- [Online Payments Tanzania — DPO Pay by Network](https://dpogroup.com/online-payments/tanzania/)
- [The Bank of Tanzania acknowledges DPO Pay as a licensed PSP](https://dpogroup.com/blog/the-bank-of-tanzania-acknowledges-dpo-pay-as-a-licensed-psp/)
- [VAT Regulations For Merchants In Africa & DPO Policy — DPO Blog](https://dpogroup.com/vat-regulations-for-merchants-in-africa/)
- [Selcom — Business](https://www.selcom.net/business)
- [Selcom Pay](https://www.selcom.net/selcom-pay-)
- [Selcom Developers](https://developers.selcommobile.com/)
- [AzamPay](https://azampay.com/)
- [AzamPay Payment Gateway product page](https://azampay.com/products/payment-gateway)
- [AzamPay Developers](https://azampay.com/developers)
- [Pesapal Tanzania — Business](https://www.pesapal.com/tz/business/online)
- [Pesapal Tanzania](https://www.pesapal.com/tz)
- [Payment Gateway in Tanzania: Why Pesapal is Power — Pesapal Blog](https://www.pesapal.com/blog/payment-gateway-in-tanzania-why-pesapal-is-powering-the-future-of-digital-transactions)
- [TANQR Code Standard 2022 — Bank of Tanzania circular (PDF)](https://www.bot.go.tz/Publications/Acts,%20Regulations,%20Circulars,%20Guidelines/Circulars/en/2022081908435357.pdf)
- [Bank of Tanzania — Payment System Initiatives (TIPS)](https://www.bot.go.tz/PaymentSystem/Initiatives)
- [BoT connects all payment providers to TIPS — Daily News](https://dailynews.co.tz/bot-connects-all-payment-providers-to-tips/)
