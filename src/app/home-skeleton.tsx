import { PatternCorner } from "@/components/pattern-bg";

// The shape of Home (greeting, journey card, today's tiles) shown while its
// data loads, so the app paints immediately on open instead of waiting.
export function HomeSkeleton() {
  return (
    <main
      className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-8 overflow-hidden px-6 py-10"
      aria-busy="true"
      aria-label="Loading"
    >
      <PatternCorner corner="top-right" />
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="h-16 animate-pulse rounded-xl bg-muted" />
      <div className="space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
