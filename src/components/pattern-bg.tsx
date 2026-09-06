"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// Original geometric line-art (two overlapping squares + a center ring form
// an eight-pointed star, the classic Islamic/Moroccan lattice motif) — not
// derived from any licensed asset. Used as a faint watermark texture only;
// never more than ~10% opacity so it never competes with real content.
function StarLatticeDefs({ patternId }: { patternId: string }) {
  return (
    <pattern
      id={patternId}
      width="34"
      height="34"
      patternUnits="userSpaceOnUse"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <rect x="8.5" y="8.5" width="17" height="17" />
        <rect
          x="8.5"
          y="8.5"
          width="17"
          height="17"
          transform="rotate(45 17 17)"
        />
        <circle cx="17" cy="17" r="4" />
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

/** Faint star-lattice texture radiating from one corner, fading to nothing. */
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
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden text-foreground",
        className,
      )}
      style={{
        opacity: 0.06,
        maskImage: `radial-gradient(circle at ${position}, black 0%, transparent 45%)`,
        WebkitMaskImage: `radial-gradient(circle at ${position}, black 0%, transparent 45%)`,
      }}
    >
      <svg width="100%" height="100%">
        <StarLatticeDefs patternId={patternId} />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

/** Faint star-lattice band across the top and bottom edges, plain in the middle. */
export function PatternBorder({ className }: { className?: string }) {
  const patternId = useId();
  const maskId = useId();
  const fadeId = useId();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden text-foreground",
        className,
      )}
      style={{ opacity: 0.06 }}
    >
      <svg width="100%" height="100%">
        <defs>
          <StarLatticeDefs patternId={patternId} />
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="16%" stopColor="white" stopOpacity="0" />
            <stop offset="84%" stopColor="white" stopOpacity="0" />
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
