Type: grilling
Status: resolved
Blocked by: 10

## Question

Today, a day's devotional content only exists as a *Session* inside a Formation Journey, run through the fixed Formation Loop (Scripture → Explore → Reflect → Pray → Practice → Connect → Next Step → Engage; CONTEXT.md). There's no standalone "Daily Devotion" concept — a user reaches today's content by going Home → current Journey → current Session.

Promoting "Daily Devotion" to its own top-level nav item raises questions ticket 02 (data model) and ticket 06 (screens) didn't need to answer:

- Is Daily Devotion a *new entry point* to the same Session/Formation Loop data (i.e. a tab that deep-links straight to "today's session" instead of routing through Journey → Session), or a *new, separate* piece of content distinct from a Journey Session?
- If it's the same underlying Session, does the Formation Loop's own internal sequence (Scripture first, then Explore/Reflect/Pray/Practice/Connect) still apply when entered from a "Devotion" tab, or does Devotion imply a shorter, single-sitting daily reading distinct from a full multi-step Session?
- What happens once a user finishes the 7-day "Faith in Christ" journey — does the Devotion tab keep surfacing content (from the next Formation Domain's journey), and if there's no active journey, what does the tab show?
- Does this replace the Home screen's existing "Next Step" surfacing of the current session (white paper §17), or sit alongside it as a second path to the same thing?

## Answer

Daily Devotion gets **its own screen**, distinct from Scripture, as one of the four peer cards in the Evolve Hub (ticket 10). It is not merely a deep link into the Journey/Session screen at a particular step.

At the same time, Devotion and Scripture (and Journeys, Prayer, Practice) **remain able to converge into the shared Formation Session/Formation Loop where appropriate** — the point isn't four independent, parallel formation systems, it's four doors into one coherent formation ecosystem. Concretely: the underlying content a Devotion screen shows for "today" can be the same data as the current Session's Explore/Reflect step, surfaced through a dedicated UI rather than forcing the user through Journey → Session navigation to reach it.

This sits **alongside**, not in place of, Home's existing Next Step/Today surfacing (white paper §17) — Home's "Today" row keeps its own Devotion and Scripture shortcuts per the locked information architecture (ticket 10), so there are now two paths to the same content: via Home's quick shortcuts, or via Evolve → Daily Devotion.

**Left open for the implementation ticket** (not blocking, per the "don't design the entire experience yet" scoping from this round):
- Whether the Formation Loop's full internal sequence (Scripture → Explore → Reflect → Pray → Practice → Connect → Next Step → Engage) plays out when entered from the Devotion screen specifically, or whether Devotion is deliberately a shorter, single-sitting read distinct from working a full Session.
- What the Devotion screen shows once a user finishes the current 7-day journey (next Formation Domain's content, or an empty/"between journeys" state).

## Comments

Implemented and shipped: `/evolve/devotion` shows today's Session `explore`/`reflect` fields via the shared `Step` component — the first open item above (Explore + Reflect only, not the full Pray/Practice/Connect sequence, which stays exclusive to the Session screen). The second open item (post-completion state) got resolved along the way during QA: a completed-journey user was seeing a misleading "Begin your journey" prompt; fixed to distinguish not-started from completed, showing "You've completed your current journey — a new devotion will be ready when your next journey begins" with a Review link. Verified live.

