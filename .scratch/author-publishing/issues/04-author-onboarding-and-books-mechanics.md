Type: grilling
Status: resolved
Blocked by: 02

## Question

Ticket 02's submission workflow assumes someone already has author standing, and left format/rights/payments unaddressed. What's left before this is buildable:

- How does someone become an author able to submit books?
- What file format(s) can a manuscript be, and is a purchased book read in-app or download-only?
- What's the rights/legal attestation mechanism at submission time?
- Pricing model shape: one-time purchase per book, a subscription unlocking all premium content, or both?
- Is paying out non-founder authors in scope for V1, or deferred?

## Answer

**Author onboarding — self-serve application, admin-approved.** Any registered user can apply: name, short bio, why they want to publish, optional website/profile, agreement to publishing requirements. Admin can approve, reject, request more info, or suspend/revoke author privileges later. **Two separate approvals, not one**: *author approval* ("we allow this person to submit books") is distinct from *book approval* ("we approve this particular book") — ticket 02's submission workflow is the second gate; this is the first, upstream of it.

**Format & reading experience — PDF + EPUB upload, download-only for V1.** No in-app reader this round. Flow: author uploads PDF/EPUB → Admin reviews (ticket 02) → approved → made available (free or paid) → user purchases/accesses → download. An in-app "Read in The Leap" experience (chapter navigation, progress, bookmarks, notes, font controls, dark mode, resume, offline, content-protection) is explicitly a V2/fast-follow, not a V1 blocker.

**Rights attestation — required, recorded.** At submission: "I confirm that I own the rights to this work, or have permission to publish it." Recorded fields: author/user ID, submission ID, the attestation text version, and timestamp — versioning the attestation text itself means a future wording change doesn't retroactively misrepresent what an earlier author actually agreed to. Doesn't replace real Terms of Service/publishing agreements (founder's call, Out of scope) — it's a submission-level record of representation.

**Pricing — Free + one-time purchase per book for V1. Leap+ subscription explicitly deferred**, not built alongside it. Reasoning: a subscription is a second commercial system entirely (billing cycles, renewal, cancellation, failed payments, grace periods, entitlement management, what-happens-to-already-accessed-books-on-lapse) — none of that is needed to prove the Library itself works. **Architect the access model to stay extensible anyway**:

```
BOOK ACCESS
├── FREE
├── PURCHASED
└── SUBSCRIPTION   (future — Leap+)
```

**Author payouts — tracked, not automated, in V1.** Data model records book, author, sales, gross revenue, refunds, net amount, and amount owed to author — but no automatic payout mechanism. V1 flow: user purchases → revenue comes through the platform → Admin periodically verifies sales and calculates each author's share → paid manually outside the app (bank transfer/invoice). Automatic revenue splitting, payout accounts, thresholds, and tax/identity requirements are their own future financial-infrastructure project.

**Guiding principle for this whole area, worth keeping**: separate *content ownership* (the author owns/submits the work) from *publishing authority* (Admin controls whether the platform publishes it) from *access* (the user controls whether they purchase it) from *distribution* (the platform controls the mechanism). Anyone can aspire to contribute; nobody can publish without review.

## Locked summary

| Question | Decision | Status |
|---|---|---|
| Author access | Self-serve application + Admin approval | Locked |
| Manuscript formats | PDF + EPUB | Locked |
| Reading experience | Download-only for V1 | Locked |
| Rights | Mandatory attestation, recorded | Locked |
| Pricing | Free + one-time purchase | Locked |
| Leap+ subscription | Deferred, architected for | Deferred |
| Author payouts | Manual, outside the app, for V1 | Locked |
| Automatic payout infrastructure | Deferred | Deferred |
