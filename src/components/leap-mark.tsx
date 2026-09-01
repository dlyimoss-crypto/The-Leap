export function LeapMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="The Leap"
    >
      <path
        d="M18 92 H40 V76 H60 V60 H80"
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M80 60 C88 48, 94 38, 100 26"
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M100 26 L88 30 M100 26 L96 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
