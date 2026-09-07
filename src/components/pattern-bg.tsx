"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// Flowing wave-line motif — thin curved lines drifting across the tile,
// inspired by the founder-supplied reference art. Drawn from scratch as a
// seamless vector tile (each line completes exactly one period across the
// tile width so it repeats without a seam). Kept intentionally light so it
// never competes with real content, but tinted with the brand color and
// given enough opacity to actually read in light mode, not just dark.
const TILE = 140;

const WAVE_LINES: { y: number; amp: number; dir: 1 | -1 }[] = [
  { y: 14, amp: 7, dir: 1 },
  { y: 42, amp: 10, dir: -1 },
  { y: 70, amp: 8, dir: 1 },
  { y: 98, amp: 10, dir: -1 },
  { y: 126, amp: 7, dir: 1 },
];

function FlowingLinesDefs({ patternId }: { patternId: string }) {
  return (
    <pattern
      id={patternId}
      width={TILE}
      height={TILE}
      patternUnits="userSpaceOnUse"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
        {WAVE_LINES.map(({ y, amp, dir }) => (
          <path
            key={y}
            d={`M0 ${y} Q ${TILE / 4} ${y - dir * amp} ${TILE / 2} ${y} T ${TILE} ${y}`}
          />
        ))}
      </g>
    </pattern>
  );
}

const CORNER_POSITION: Record<string, string> = {
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

/** Faint flowing-line texture radiating from one corner, fading to nothing. */
export function PatternCorner({
  corner = "top-right",
  className,
}: {
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const patternId = useId();
  const position = CORNER_POSITION[corner];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden text-primary opacity-[0.32] dark:opacity-[0.22]",
        className,
      )}
      style={{
        maskImage: `radial-gradient(circle at ${position}, black 0%, transparent 55%)`,
        WebkitMaskImage: `radial-gradient(circle at ${position}, black 0%, transparent 55%)`,
      }}
    >
      <svg width="100%" height="100%">
        <FlowingLinesDefs patternId={patternId} />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

/** Faint flowing-line band across the top and bottom edges, plain in the middle. */
export function PatternBorder({ className }: { className?: string }) {
  const patternId = useId();
  const maskId = useId();
  const fadeId = useId();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden text-primary opacity-[0.32] dark:opacity-[0.22]",
        className,
      )}
    >
      <svg width="100%" height="100%">
        <defs>
          <FlowingLinesDefs patternId={patternId} />
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="28%" stopColor="white" stopOpacity="0" />
            <stop offset="72%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
