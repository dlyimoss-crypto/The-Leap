Type: grilling
Status: resolved

## Question

What should the V1 "basic notification system" (white paper §30, item 10) actually notify on, and through what channel? As a web app, push notifications mean web push (browser-dependent, no notification when the tab/browser's fully closed on some platforms) rather than native mobile push — does V1 need email as the reliable fallback channel for things like "someone prayed for you" or "your daily next step is ready," or is in-app-only (bell icon, per the mockups) sufficient for V1?

## Answer

**In-app only** — the `notifications` table (ticket 02) plus Supabase Realtime for a live-updating bell badge, no page refresh needed. No web push (service worker, VAPID, permission UX) and no email (provider, templates, deliverability) until real usage data says a channel beyond in-app is worth the infrastructure.

**Three notification types, deliberately not more**:
1. `prayer_response` — "[Name] prayed for your request."
2. `comment_received` — "[Name] commented on your post."
3. `content_moderated` — "Your post was removed by a moderator." / "Your post has been restored." (transparency about what happened, rather than content silently vanishing)

**Explicitly excluded**: per-reaction notifications (counts are already live on the post; five reactions shouldn't mean five notifications) and any "come back and finish today's devotion" reminder — the white paper's own UX principles (§41: "notifications should invite rather than manipulate," "the interface should feel calm rather than addictive") rule that out directly, not just as a V1 scope cut.
