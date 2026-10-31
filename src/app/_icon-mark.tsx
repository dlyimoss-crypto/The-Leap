import {
  LEAP_ARC_DOT,
  LEAP_ARC_PATH,
  LEAP_ARC_STROKE,
} from "@/components/brand-mark";

// Shared visual for the generated app icons (apple-icon, icon-192/512 for
// the manifest): the Leap Arc in cream on a full-bleed brand-orange square.
// Full bleed because iOS and Android apply their own corner masks. Kept out
// of routing via the `_` prefix.
export function IconMark({ mark }: { mark: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FF7A00",
      }}
    >
      <svg width={mark} height={mark} viewBox="0 0 100 100">
        <path
          d={LEAP_ARC_PATH}
          fill="none"
          stroke="#FAF7F2"
          strokeWidth={LEAP_ARC_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={LEAP_ARC_DOT.cx}
          cy={LEAP_ARC_DOT.cy}
          r={LEAP_ARC_DOT.r}
          fill="#FAF7F2"
        />
      </svg>
    </div>
  );
}
