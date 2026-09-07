import { ImageResponse } from "next/og";

export const alt = "The Leap — Your Essential Companion in Christ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          background:
            "linear-gradient(135deg, #FF7A00 0%, #C9642E 45%, #343434 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          The Leap
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            fontWeight: 700,
            marginTop: 16,
            maxWidth: 920,
            lineHeight: 1.15,
          }}
        >
          Take your next step with Christ
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 28,
            maxWidth: 840,
            lineHeight: 1.4,
            opacity: 0.94,
          }}
        >
          A daily companion for prayer, scripture and community — join a
          global family growing together. Born from Africa. For the world.
        </div>
      </div>
    ),
    { ...size },
  );
}
