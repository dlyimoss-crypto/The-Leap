"use client";

import dynamic from "next/dynamic";

// react-pdf touches browser-only APIs (DOMMatrix, Path2D, the PDF.js worker)
// at module-load time, so it can't survive being evaluated during SSR — this
// dynamic import with ssr:false is what keeps it out of the server render.
const PdfViewer = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading book…</p>
      </div>
    ),
  },
);

export function PdfFrame({ src, title }: { src: string; title: string }) {
  return <PdfViewer src={src} title={title} />;
}
