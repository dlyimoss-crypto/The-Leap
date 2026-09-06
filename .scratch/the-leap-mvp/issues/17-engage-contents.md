Type: task
Status: resolved

## Question

Engage's contents: what screens/features live under the Engage tab? Left as fog in the original nav-restructure round (ticket 10) — the tab shipped as a bare "Coming soon" placeholder.

## Answer

Engage becomes a hub (same `HubCard` pattern as Evolve/Connect) with two features shipped now and one deferred:

- **Invite a Friend** (`/engage/invite`): the lightest version of "Multiply" — share or copy a link to the app via the Web Share API, no new data model.
- **Serve & Missions** (`/engage/serve`): a curated, admin-authored directory of ways to serve, same draft/published shape as Journeys and the same list-card pattern as the Churches directory. New `service_opportunities` table.
- **Give / support the ministry**: considered and explicitly deferred — real payments/compliance work, and the MVP build plan already puts monetization out of scope (see Notes above). Revisit as its own effort once there's a payment-provider decision, not folded into this round.
