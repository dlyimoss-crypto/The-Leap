/**
 * The standalone Leap mark — two forward-facing chevrons, layered: back
 * one is always brand orange, front one is always charcoal (fixed, both
 * light and dark mode), matching the source files exactly
 * (public/brand/the-leap-mark.svg).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={className}
      role="img"
      aria-label="The Leap"
    >
      <path fill="#FF7A00" d="M15 10h62l72 62-72 62H15l72-62-72-62z" />
      <path fill="#343434" d="M91 10h62l72 62-72 62H91l72-62-72-62z" />
    </svg>
  );
}
