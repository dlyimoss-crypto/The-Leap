Type: grilling
Status: resolved

## Question

What does the V1 safety/moderation/reporting flow actually look like? White paper §18, §19, §24, and §39 give principles (strong safeguarding, reporting, blocking, privacy, pastoral escalation, crisis-situation boundaries, no public labeling by maturity level) but no concrete flow. For a solo-built V1 with no moderation team yet: what gets auto-flagged vs. queued for the founder's manual review, what does a user's "report" action actually do, what happens to a blocked user's content, and what's the crisis-escalation path (referral copy + resources) for prayer requests or community posts that signal self-harm or abuse, given there's no professional support team behind the product yet?

## Answer

**Report flow**: reporting a post, comment, or prayer request immediately flips its status to `hidden` and creates a `reports` row. The founder reviews the queue and either restores it (`status → visible`) or removes it permanently (`status → removed`, a soft delete — content stays in the database for audit/abuse-pattern purposes but never renders to any user again). `reports` gains a `resolution` field (`restored` \| `removed`, null until acted on) alongside its existing `status` (`open` \| `resolved`). This means `posts`, `comments`, and `prayer_requests` (from ticket 02) need their `status` enum widened from `visible | hidden` to **`visible | hidden | removed`**.

**Crisis keyword detection**: a static keyword/phrase list (self-harm, suicide, abuse, immediate danger, serious crisis) checked server-side on submission of a `post` or `prayer_request` (not `reflections` — private, never scanned). A match does **not** hide the content or block submission — the person in crisis likely wants their request visible to receive prayer/support, not censored — it (a) shows the author an inline banner immediately: *"You don't have to go through this alone. If you're in immediate danger or thinking about harming yourself, please seek immediate help. [Find crisis support in your country →] You can also contact a trusted person, local church, professional counselor, or emergency service."*, linking to findahelpline.com, and (b) auto-creates a `reports` row (`reason: "auto_crisis_detection"`) so it lands in the founder's queue for a same-day human check, without waiting on another user to report it.

**Blocking, two separate mechanisms**:
- **User block** (personal, not punitive): new `blocks` table — `blocker_id`, `blocked_id`, `created_at`, unique per pair. Filters the blocked user's posts/comments/prayer requests out of the blocker's own views only; the blocked user is otherwise unaffected and unaware.
- **Admin ban** (platform-wide): `profiles` (from ticket 02) gains an `is_banned` boolean, separate from `role` — `role` is about permissions (user/admin), `is_banned` is about standing. A banned user can't create posts, comments, prayer requests, or reactions; existing content is untouched unless separately removed.

This resolves the schema gap ticket 02 left open — `blocks` and `profiles.is_banned` are additions to that ticket's table list, not a new data-model decision.

**Addendum (ticket 04)**: this keyword list became one shared module, also reused to check Companion chat messages (both the user's message and the model's reply) — one safety system, not several.
