import { ImageResponse } from "next/og";
import { IconMark } from "./_icon-mark";

// iOS ignores icon.svg for "Add to Home Screen" — it only reads
// apple-touch-icon, which must be a raster PNG. Without this file there was
// no such tag at all, so iOS fell back to a screenshot of the page instead
// of the mark. 180x180 is Apple's recommended base size (@3x on a 60pt
// icon); iOS applies its own corner rounding, so the mark sits on a full
// bleed background rather than a pre-rounded square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconMark mark={112} />, { ...size });
}
