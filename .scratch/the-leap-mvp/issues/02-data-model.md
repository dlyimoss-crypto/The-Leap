Type: grilling
Status: resolved

## Question

What's the V1 schema? White paper §31 gives the conceptual chain: USER → FORMATION PROFILE → CURRENT JOURNEY → CURRENT SESSION → COMPLETED SESSIONS → REFLECTIONS → COMMITMENTS → COMMUNITY → ENGAGEMENT → NEXT-STEP RECOMMENDATION. That needs to become actual tables/fields covering: users/profiles, formation domains, formation journeys, sessions (with their Scripture/Explore/Reflect/Pray/Practice/Connect content per the Formation Loop), a user's journey progress, reflections (private-by-default per §39), weekly commitments, community posts + comments + reactions, prayer requests + "I Prayed" responses, groups, and notifications.

Needs `domain-modeling` to keep this consistent with the vocabulary in [CONTEXT.md](../../../CONTEXT.md) (Formation Domain vs. Formation Journey vs. Session are distinct and shouldn't blur).

## Answer

**Formation content (domains, journeys, sessions, Scripture/Explore/Reflect/Pray/Practice text) is content-as-code** — structured files in the repo, one directory per language (`content/en/faith-in-christ/day-1.json`, `content/sw/faith-in-christ/day-1.json`, etc.), not database rows. This is what makes the five-language ambition (English, Swahili, French, German, Chinese) cheap to grow into: adding a language is adding a directory, never a migration. The database only tracks a user's *relationship* to that content, referencing it by a stable slug (e.g. `journey_slug: "faith-in-christ"`, `session_number: 3`) that's identical across every language version.

**Tables** (Postgres, via Supabase):

- **`profiles`** — extends `auth.users`. `display_name`, `avatar_url`, `preferred_language` (`en` \| `sw` \| `fr` \| `de` \| `zh`, default `en`), `role` (`user` \| `admin`), `is_banned` (bool, default false — added by ticket 08).
- **`journey_progress`** — one row per user per journey they've started: `user_id`, `journey_slug`, `current_session_number`, `started_at`, `completed_at`. The Next-Step Engine's fast-lookup source for "what's this user's active journey."
- **`session_completions`** — append-only history: `user_id`, `journey_slug`, `session_number`, `completed_at`.
- **`reflections`** — always private, no visibility field at all (enforced by row-level security, not a flag a user could flip): `user_id`, `journey_slug` (nullable), `session_number` (nullable, for freeform entries), `prompt`, `body`, `created_at`.
- **`commitments`** — `user_id`, `body`, `status` (`active` \| `completed`), `week_of`, `created_at`, `completed_at`.
- **`prayer_requests`** — `user_id`, `body`, `visibility` (`public` \| `private`), `is_anonymous`, `status` (`open` \| `answered` \| `hidden` \| `removed` — widened by ticket 08), `testimony` (nullable text, set when `status → answered` — added by ticket 06), `created_at`. `is_anonymous` only affects what's *displayed*; `user_id` is always retained for moderation and can't itself be anonymous.
- **`prayer_responses`** — the "I Prayed" action: `prayer_request_id`, `user_id`, `created_at`, unique per pair so one prayer per person per request.
- **`posts`** — one shared community space, no groups: `user_id`, `body`, `status` (`visible` \| `hidden` \| `removed` — widened by ticket 08), `created_at`.
- **`comments`** — `post_id`, `user_id`, `body`, `status` (same three-value enum), `created_at`.
- **`reactions`** — `post_id`, `user_id`, `type` (`encourage` \| `pray`), `created_at`, unique per `(post_id, user_id, type)`.
- **`reports`** — moderation queue: `reporter_id`, `target_type` (`post` \| `comment` \| `prayer_request` \| `user`), `target_id`, `reason` (free text, or `"auto_crisis_detection"` — see ticket 08), `status` (`open` \| `resolved`), `resolution` (`restored` \| `removed`, null until resolved — added by ticket 08), `created_at`.
- **`blocks`** — added by ticket 08: `blocker_id`, `blocked_id`, `created_at`, unique per pair. Filters the blocked user's content out of the blocker's own views only.
- **`notifications`** — generic enough to cover whatever ticket 09 decides to trigger on: `user_id`, `type`, `payload` (jsonb), `read_at`, `created_at`.
- **`companion_messages`** — added by ticket 04: `user_id`, `conversation_id`, `role` (`user` \| `assistant`), `content`, `created_at`. Owner-only RLS, same posture as `reflections`. No retention/archiving/export logic in V1.

**Row-level security**: `reflections` and `commitments` — owner-only, always. `prayer_requests` — owner, or public + not hidden. `posts`/`comments` — visible to all if `status = visible`. `profiles.role = admin` bypasses all of the above for moderation.

**"Admin/content management" (V1 priority list item 11) is therefore mostly moderation UI**, not a content editor: acting on `reports`, toggling `status` on posts/comments/prayer_requests, banning a `profiles` row — not a CMS for formation content, which is now a code change instead.
