"use client";

import dynamic from "next/dynamic";
import { createContext, useContext } from "react";
import type { BooksMessages } from "@/lib/i18n/messages/en/books";

// next/dynamic's `loading` component doesn't receive the wrapped
// component's props, so the localized text reaches it through context.
const LoadingTextContext = createContext("");

function PdfLoading() {
  const text = useContext(LoadingTextContext);
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

// react-pdf touches browser-only APIs (DOMMatrix, Path2D, the PDF.js worker)
// at module-load time, so it can't survive being evaluated during SSR — this
// dynamic import with ssr:false is what keeps it out of the server render.
const PdfViewer = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: PdfLoading,
  },
);

export function PdfFrame({
  src,
  title,
  dict,
}: {
  src: string;
  title: string;
  dict: BooksMessages["reader"];
}) {
  return (
    <LoadingTextContext value={dict.loading}>
      <PdfViewer src={src} title={title} dict={dict} />
    </LoadingTextContext>
  );
}
