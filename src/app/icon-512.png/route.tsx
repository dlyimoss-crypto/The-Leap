import { ImageResponse } from "next/og";
import { IconMark } from "../_icon-mark";

export async function GET() {
  return new ImageResponse(<IconMark mark={320} />, {
    width: 512,
    height: 512,
  });
}
