# The Leap

Your essential companion in Christ. A Christ-centered digital discipleship web app.

## Stack

TypeScript, Next.js (App Router), Supabase (Postgres, Auth, Storage, Edge Functions), Vercel, Tailwind CSS + shadcn/ui, Claude API (Leap Companion). Decided in [.scratch/the-leap-mvp/issues/01-tech-stack.md](.scratch/the-leap-mvp/issues/01-tech-stack.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Anthropic keys
npm run dev
```

Apply the schema in [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) to your Supabase project (SQL editor, or the Supabase CLI).

## Testing

```bash
npm test        # run once
npm run test:watch
```

TDD workflow: see the `tdd` skill in `.claude/skills/`.

## Project planning

The full MVP build plan — schema, screens, safety flow, scope decisions — lives in [.scratch/the-leap-mvp/map.md](.scratch/the-leap-mvp/map.md), charted with the `wayfinder` skill. Domain vocabulary is in [CONTEXT.md](CONTEXT.md).
