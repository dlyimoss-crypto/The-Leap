"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";

// Must be set in this module (not a shared setup file) — react-pdf resolves
// the worker at the point <Document> first renders, and a later import can
// silently overwrite an earlier assignment.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PAGE_WIDTH = 720;

export function PdfViewer({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        setPageWidth(Math.min(width - 32, MAX_PAGE_WIDTH));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        setPageNumber((p) => Math.max(1, p - 1));
      } else if (event.key === "ArrowRight") {
        setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));
      }
    }
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [numPages]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-1 flex-col items-center overflow-y-auto bg-muted/30 py-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setStatus("ready");
        }}
        onLoadError={(err) => {
          console.error(`Failed to render PDF "${title}"`, err);
          setStatus("error");
        }}
        loading={
          <p className="text-sm text-muted-foreground">Loading book…</p>
        }
        error={null}
        className="flex flex-1 items-start justify-center"
      >
        {pageWidth && (
          <Page
            pageNumber={pageNumber}
            width={pageWidth}
            className="shadow-sm"
          />
        )}
      </Document>

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-sm font-medium">
            This PDF couldn&apos;t be loaded.
          </p>
          <p className="text-sm text-muted-foreground">
            The file may be corrupted or in an unsupported format.
          </p>
        </div>
      )}

      {status === "ready" && !!numPages && (
        <div className="sticky bottom-3 mt-4 flex items-center gap-3 rounded-full border bg-card px-3 py-1.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous page"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {pageNumber} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next page"
            disabled={pageNumber >= numPages}
            onClick={() =>
              setPageNumber((p) => Math.min(numPages, p + 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
