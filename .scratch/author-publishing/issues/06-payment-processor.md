Type: research
Status: resolved

## Question

Ticket 04 settled the pricing model (Free + one-time purchase per book, Leap+ deferred) and ticket 05 locked the checkout *direction* (embedded/hosted, in-app-feeling) without picking a processor. Which payment processor should power one-time book purchases for V1?

The founder/business entity is based in **Tanzania** — payout eligibility (not just accepting cards from global buyers) is the critical constraint, since most major processors support charging cards from nearly anywhere but only pay out to businesses in a supported subset of countries. Also relevant: refund support (ticket 04's data model tracks refunds), ease of an embedded/hosted checkout integration from a Next.js app, fees, and whether the same processor could later support a Leap+ subscription without a rebuild.

**Also to evaluate — a non-processor alternative the founder raised**: a manual mobile-money/bank-transfer flow. The buyer sees a QR code (and/or plain payment details — a Tigo Pesa/M-Pesa/Airtel Money "lipa namba"/till number, or a bank account) for the founder's own account, pays directly, then claims the purchase (e.g. a transaction reference) for manual admin verification before the download unlocks. No processor, no payout-eligibility problem at all since money goes straight to the founder's own account — but no instant unlock, no service to international/card-only buyers, and real admin workload per sale. Worth a clear recommendation on whether this is V1's primary approach, a secondary option alongside an automated processor, or not worth it.

## Answer

Full comparison: [research/payment-processors.md](../research/payment-processors.md)

**Primary: Flutterwave.** The only candidate confirmed via its own official documentation to solve both halves of the problem at once — Tanzania payout eligibility (Bank-of-Tanzania-licensed Payment Service Provider) and Tanzania mobile money acceptance (Airtel Money named explicitly in its own developer docs). Offers a hosted/inline JS checkout matching ticket 05's locked "embedded, in-app-feeling" direction, an official Node.js SDK, a documented Refund API (`POST /v3/transactions/{id}/refund`), and a "Payment Plans" feature — the clearest path in the whole comparison to adding Leap+ later without switching processors. It's a plain gateway, not a merchant of record, so The Leap remains responsible for its own tax/VAT compliance — an acceptable tradeoff at this transaction volume/geography.

**Confirmed dead ends**: Stripe and Paystack — no payout path exists for a Tanzania-based seller, straight from their own country-support pages.

**Backup if Flutterwave's Tanzania onboarding proves slow in practice** (its Tanzania operation is newer/thinner than its Nigeria/Kenya/Ghana business): **Pesapal** (clean published 3.5% fee, multi-country East African regulator coverage including Tanzania) or **Selcom** (Tanzania-headquartered, so payout eligibility is structurally moot).

**Notable finding, not adopted**: Paddle and Lemon Squeezy both confirm Tanzania payout support directly in their own docs (genuinely surprising and useful), but neither supports any East African mobile money — cards/wallets only — and their flat $0.50-per-transaction fee eats 15–50% of a $1–3 book. They only solve the founder-payout half of the problem, not the local-buyer half.

**On the manual mobile-money/QR flow**: confirmed technically legitimate, not just an ad hoc idea — Tanzania has a Bank-of-Tanzania-mandated national QR standard (**TAN-QR**, 2022) and **TIPS** (an instant interoperable payment rail already connecting 39 banks and 6 telecoms). **Not adopted as V1's primary path** — it means no instant unlock (a human must verify each sale before the download unlocks) and serves zero international/card-paying buyers. Kept as a documented fallback only, to use temporarily if Flutterwave's Tanzania KYC takes longer to clear than the launch timeline allows — not a standing second checkout path once Flutterwave is live.
