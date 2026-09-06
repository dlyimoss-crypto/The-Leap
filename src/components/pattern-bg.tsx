"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// Original line-art (a radiating sun-burst medallion, a triangle-zigzag
// border row, a dashed ring and a scatter of dots — drawn from scratch in
// the spirit of African textile/Ankara print motifs) — not derived from any
// licensed asset. Used as a faint watermark texture only; never more than
// ~10% opacity so it never competes with real content.
function TribalMotifDefs({ patternId }: { patternId: string }) {
  return (
    <pattern
      id={patternId}
      width="120"
      height="120"
      patternUnits="userSpaceOnUse"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        {/* sun-burst medallion */}
        <circle cx="30" cy="30" r="14" />
        <circle cx="30" cy="30" r="8" />
        <circle cx="30" cy="30" r="2.2" fill="currentColor" stroke="none" />
        <line x1="45" y1="30" x2="49" y2="30" />
        <line x1="40.6" y1="40.6" x2="43.4" y2="43.4" />
        <line x1="30" y1="45" x2="30" y2="49" />
        <line x1="19.4" y1="40.6" x2="16.6" y2="43.4" />
        <line x1="15" y1="30" x2="11" y2="30" />
        <line x1="19.4" y1="19.4" x2="16.6" y2="16.6" />
        <line x1="30" y1="15" x2="30" y2="11" />
        <line x1="40.6" y1="19.4" x2="43.4" y2="16.6" />

        {/* triangle-zigzag row along the tile's top edge */}
        <path d="M0 6 L7.5 0 L15 6 L22.5 0 L30 6 L37.5 0 L45 6 L52.5 0 L60 6 L67.5 0 L75 6 L82.5 0 L90 6 L97.5 0 L105 6 L112.5 0 L120 6" />

        {/* dashed ring + small secondary ring */}
        <circle cx="92" cy="90" r="12" strokeDasharray="1.5 3" />
        <circle cx="88" cy="42" r="6" />

        {/* scattered dots */}
        <circle cx="10" cy="88" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="105" cy="18" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="65" cy="100" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="62" r="1.1" fill="currentColor" stroke="none" />
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

/** Faint tribal-motif texture radiating from one corner, fading to nothing. */
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
        <TribalMotifDefs patternId={patternId} />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

/** Faint tribal-motif band across the top and bottom edges, plain in the middle. */
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
          <TribalMotifDefs patternId={patternId} />
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
