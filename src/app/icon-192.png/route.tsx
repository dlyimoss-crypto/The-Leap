import { ImageResponse } from "next/og";
import { IconMark } from "../_icon-mark";

// A stable, predictable path for the manifest's icons array — the
// numbered icon/apple-icon file conventions produce hashed URLs Next
// injects into <head> itself, not something safe to hardcode elsewhere.
export async function GET() {
  return new ImageResponse(<IconMark mark={120} />, {
    width: 192,
    height: 192,
  });
}
