Type: grilling
Status: resolved

## Question

The user wants Daily Devotion, Scripture, and Books/Literature Library each promoted to their own top-level nav item, rather than living inside the Formation Journey flow. Two things already on record make this not a simple "add three tabs" change:

1. **CONTEXT.md already specifies a top-nav model that was never built.** "The Four Core Movements" (`CONNECT` → `COMMIT` → `EVOLVE` → `ENGAGE`, with `MULTIPLY` as the mature outcome) are documented as "the top-level navigation and discipleship posture... also the four primary nav tabs plus Home." What actually shipped (`src/components/bottom-nav.tsx`) is Home / Prayer / Community / Companion (+ Admin for admins) — a screen-based nav with no relationship to the Four Core Movements language. That divergence predates this request and was never reconciled.
2. **Mobile bottom-nav capacity is real.** Today's nav already has 4–5 items. Adding Daily Devotion, Scripture, and Books/Literature Library as three more top-level items makes 7–8, which doesn't fit a bottom nav bar on a phone screen.

This ticket is the one to resolve before 11/12/13 can be built:

- Does the nav restructure toward the documented Four Core Movements model, or formalize the screen-based model that's already shipped (and retroactively update CONTEXT.md to match reality)?
- Given mobile nav-capacity limits, how do Daily Devotion, Scripture, and Books/Literature Library actually surface — are all three top-level tabs, or does some subset live behind a "More" tab / one of the Four Core Movements groupings, or replace an existing tab?
- Journeys currently isn't in the bottom nav at all — it's reached from Home. Does that stay true once Devotion and Scripture are pulled out of it, or does the Journeys entry point change too?

## Answer

**Navigation is formally standardized as Home / Connect / Commit / Evolve / Engage** — five literal bottom-nav tabs, matching CONTEXT.md's "Four Core Movements" exactly rather than the screen-based nav that had actually shipped (`Home/Prayer/Community/Companion/Admin`). Home is the user's personal starting point; Connect, Commit, Evolve, and Engage are the four formation-oriented destinations. Capacity is solved by nesting, not a flat list or generic "More" tab: each movement is a hub with its own peer sub-destinations, reached one tap deeper.

**Resulting information architecture:**

```
THE LEAP
├── HOME
│   ├── Today (Devotion, Scripture, Continue Your Journey shortcuts)
│   ├── Formation progress
│   └── Companion (surfaced here too, alongside its floating entry point)
├── CONNECT
│   ├── Community
│   ├── Prayer Room
│   └── Groups
├── COMMIT
│   └── Contents — open, see map fog
├── EVOLVE  (Evolve Hub — see ticket 11/12/13 answers)
│   ├── Continue Your Journey
│   ├── Scripture
│   ├── Daily Devotion
│   └── Books & Literature
├── ENGAGE
│   └── Contents — open, see map fog
└── COMPANION
    └── Cross-cutting floating entry point (not a tab) — see this ticket's Companion answer below
```

**Companion is cross-cutting, not a nav destination.** It doesn't belong to Connect, Commit, Evolve, or Engage — it's the guide that helps a user move through the whole formation ecosystem, not one destination within it. Persistent floating entry point, present on Home, Prayer, Community, Scripture, More, and the Session/Formation-Loop screen. Tapping it opens an intent menu first (Pray with me / Help me understand Scripture / Reflect on today's devotion / Help me apply this / Encourage me / Help me take my next step) rather than dropping straight into a raw chat box. Reaffirms CONTEXT.md's existing Leap Companion definition: never simulates or claims spiritual/pastoral authority — this constrains the intent-menu copy itself (e.g. "Pray with me" must read as facilitating the user's own prayer, not leading it).

**Evolve lands on a hub, not a detour through Journeys** (resolves this ticket's own Q7): tapping Evolve shows a menu of four peer cards — Continue Your Journey, Scripture, Daily Devotion, Books & Literature — mirroring how Connect's Community/Prayer Room/Groups already work as peers. Someone wanting Scripture goes Evolve → Scripture directly, not Evolve → Journey → Scripture. Devotion, Scripture, Journeys, Prayer, and Practice remain distinct user-facing entry points but may converge into the same underlying Formation Session/Formation Loop where appropriate — four doors into one coherent formation ecosystem, not four parallel formation systems. See tickets 11 and 12 for how this plays out for Devotion and Scripture specifically.

**Intentionally still open** (doesn't block 11/12/13, since none of them depend on it):
- What belongs under Commit.
- What belongs under Engage.
- Where the Home "Today" row's fourth shortcut, Practice, leads.

**New follow-up ticket spun out of this round**: [14 — Navigation movement iconography](./14-nav-iconography.md). The mockups showed inconsistent icons per movement across screens (Commit as `+` vs. a cross; Engage as a grid-of-4 vs. a globe) — needs one canonical icon per movement, used consistently everywhere.

