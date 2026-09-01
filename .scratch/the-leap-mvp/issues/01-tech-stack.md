Type: grilling
Status: resolved

## Question

Which web app stack should The Leap MVP be built on, given it will be built solo with AI-assisted coding tools (no dev team)?

Needs to cover, out of the box or with minimal glue: auth, a relational-ish datastore (the conceptual data model in white paper §31 is clearly relational — users, journeys, sessions, reflections, posts, prayer requests, groups), file/image storage, serverless/edge functions (for the Leap Companion's AI calls and any notification logic), and a straightforward deploy story. Should also be a stack with deep, current training coverage in AI coding tools, since that's the primary leverage this build has instead of a team.

Candidates worth weighing: Next.js + Supabase (Postgres, auth, storage, edge functions bundled); Next.js + Firebase; Remix + Postgres/Prisma on a platform like Vercel/Render; a full-stack framework like Rails or Laravel (less common in AI-tool training data for greenfield 2026 work, but very fast for a solo builder who already knows one of them).

Recommended: **Next.js + Supabase.** It bundles Postgres (matches the relational data model directly), auth, storage, and edge functions in one platform, has very strong and current AI-coding-tool support, and avoids stitching together 3–4 separate vendors for a solo build.

## Answer

**TypeScript + Next.js (App Router) + Supabase (Postgres, Auth, Storage, Edge Functions) + Vercel.** The user deferred the choice to "best AI-coding-tool support + easiest solo maintenance," which converges on exactly this combination — deepest, most current training coverage of any web stack, and one vendor (Supabase) instead of three for data/auth/files/functions.

Rounding out "the stack" with the two pieces implied but not asked about directly: **Tailwind CSS + shadcn/ui** for styling/components — same reasoning (extremely well-covered by AI tools, and shadcn's copy-into-your-repo model means no black-box component library to fight later). Both are easily swappable if they turn out wrong; nothing else in this ticket depends on them.

Deploy is Vercel's default git-push-to-deploy — no separate CI ticket needed for V1; that fog item is cleared, not graduated into a ticket.

