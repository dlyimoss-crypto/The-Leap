Type: grilling
Status: resolved
Blocked by: 01

## Question

Ticket 01 decided Books & Literature is multi-author from V1 with Admin-gated publication (Author ≠ Publisher). What's the actual submission/review workflow — what can an author do, what can Admin do, and what states does a submission move through?

## Answer

**Status flow**:

```
                Submit                    Approve
DRAFT ──────────────────► PENDING REVIEW ──────────► PUBLISHED
                                │  │
                Request changes │  │ Reject
                                ▼  ▼
                        (back to  REJECTED
                         author,
                         resubmit
                         → REVIEW AGAIN)
```

States: `draft`, `pending_review`, `changes_requested`, `rejected`, `published` (plus Admin can unpublish a `published` book back out of public view). A rejected submission does not get resubmitted into the same flow — Admin decided it shouldn't proceed. A `changes_requested` submission goes back to the author, who revises and resubmits into review again.

**Author-side capabilities**:
- Create a book submission: title, author information, description, categories/tags
- Upload manuscript/book file
- Upload cover image
- Save as draft (not yet submitted)
- Submit for review
- See submission status
- Respond to requested changes (revise and resubmit)

**Admin-side capabilities** (new section under the existing `/admin` area, alongside Moderation Queue and Users):
- Review submissions: preview/download the manuscript, review metadata, review cover image
- Request changes (with feedback back to the author)
- Reject a submission
- Approve a submission
- Publish an approved book (approval and publish are named as distinct actions — approval doesn't have to mean instantly live)
- Unpublish/remove a previously published book when necessary

**Left open for a later ticket** (not blocking this workflow's shape): how someone becomes an author able to submit in the first place (self-serve application vs. admin-invited), manuscript file format/storage, cover image storage, categories/tags as a fixed list vs. free-form, and everything about pricing/payments — see ticket 04.
