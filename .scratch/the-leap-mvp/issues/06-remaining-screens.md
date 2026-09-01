Type: prototype
Status: resolved

## Question

The white paper fully specifies Onboarding (§16), Home (§17), and the Formation Journey/Session flow (§12–14). It leaves Prayer Room, Community, and Admin/content-management thinner: Prayer Room only has an example request + "I Prayed" response + a privacy principle (§19); Community only has a list of actions (Ask/Reflect/Encourage/Share/Comment/Pray/Join a group/Find a mentor) and one example prompt (§18); Admin/content-management isn't described at all beyond appearing in the V1 priority list (§30, item 11).

What should the actual screens for Prayer Room, Community, and Admin look like — layout, states (empty/populated/moderation-flagged), and the specific actions available on each?

## Answer

Prototype: [The Leap Screens](https://claude.ai/code/artifact/1910d5d5-bd00-4654-9405-ada404a9e2bc)

**Testimony** is a nullable `testimony` text column on `prayer_requests` (ticket 02), set when the author flips `status` to `answered` — not a new table. The Testimonies tab is just a filtered view.

**Community's daily prompt** is a content-as-code file per day (`community-prompts/2026-09-01.json`, etc.), shown above the composer — no prompt-management feature to build.

**Admin is exactly two screens**: a Moderation Queue (reported content, Restore/Remove/Ban, with auto-crisis-flagged reports visually distinguished from user-reported ones) and a Users list (Ban/Unban). Nothing else — analytics and content editing live elsewhere or not at all in V1.

The crisis banner from ticket 08 is shown only to the author, once, at the moment of posting — the prototype deliberately keeps it out of the public feed card to avoid broadcasting a person's crisis to everyone viewing the Prayer Room.
