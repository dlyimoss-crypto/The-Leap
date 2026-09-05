Type: task
Status: resolved
Blocked by: 10

## Question

The mockups used to work through ticket 10 show inconsistent iconography for the same movement across screens: Commit renders as a `+` on the Community/Prayer Room/Scripture screens but a cross on the Home screen; Engage renders as a four-square grid on those same screens but a globe on Home. That's draft inconsistency, not an intentional design choice, and shouldn't get carried forward into the real build.

Establish one canonical icon for each of the four movements — Connect, Commit, Evolve, Engage — and use that same icon consistently everywhere it appears: bottom nav, hub headers, Home's "Your Journey" cards, progress indicators, and any future screen. Treat the choice as part of the design system (alongside ticket 05's visual identity work), not a per-screen decision.

## Answer

Presented as a visual picker (four Lucide candidates per movement, live-previewed in an actual bottom-nav strip): https://claude.ai/code/artifact/2a37b381-2154-4b6f-9f4d-cd44fcc581e3

**Canonical icons, confirmed**: Connect → `Users`, Commit → `Flag`, Evolve → `Sprout`, Engage → `Globe`. These match what was already shipped as the implementation's placeholder choice (`src/components/bottom-nav.tsx`) — no code change needed, the placeholder is now the deliberate answer. Applied consistently everywhere a movement icon appears (bottom nav; `HubCard`/`ComingSoon` icons on `/connect`, `/commit`, `/evolve`, `/engage` reuse the same set by construction, since those pages import the same icons for their own headers/cards).

Noted but not adopted: Lucide has no literal Christian-cross glyph, so a more explicitly devotional Commit icon would require a custom SVG rather than a Lucide name — flagged during the picker round, not requested.
