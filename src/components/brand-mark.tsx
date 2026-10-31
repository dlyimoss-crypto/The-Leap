/**
 * The Leap mark ("Leap Arc"): the letter L whose foot sweeps upward into a
 * leap, with a dot ahead of it, the next step. Shown as the app-icon tile
 * (cream glyph on brand orange) so it reads the same on light and dark
 * backgrounds. Geometry is shared with the generated app icons, favicon and
 * public/brand files; keep them in step if it changes.
 */
export const LEAP_ARC_PATH = "M33 20 V57 Q33 77 52 73 Q67 69 73 50";
export const LEAP_ARC_DOT = { cx: 76, cy: 28, r: 8.5 };
export const LEAP_ARC_STROKE = 13;

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="The Leap"
    >
      <rect width="100" height="100" rx="22" fill="#FF7A00" />
      <path
        d={LEAP_ARC_PATH}
        fill="none"
        stroke="#FAF7F2"
        strokeWidth={LEAP_ARC_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle {...LEAP_ARC_DOT} fill="#FAF7F2" />
    </svg>
  );
}
