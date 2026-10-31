import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Leap — Your Essential Companion in Christ",
    short_name: "The Leap",
    description: "Your Essential Companion in Christ",
    start_url: "/",
    display: "standalone",
    // Android paints its launch screen (the icon) on background_color: the
    // same near-black the app's dark backdrop fades into, so the hand-off
    // from launch screen to Home reads as one continuous screen.
    background_color: "#0E0D0C",
    theme_color: "#0E0D0C",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
