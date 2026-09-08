"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Rendition } from "epubjs";
import { Button } from "@/components/ui/button";

export function EpubFrame({ src, title }: { src: string; title: string }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    let rendition: Rendition | null = null;

    (async () => {
      const { default: ePub } = await import("epubjs");
      if (cancelled || !viewerRef.current) {
        return;
      }

      // The streaming route has no ".epub" extension, so epub.js can't
      // infer the input type from the URL and would otherwise treat it as
      // an unarchived directory of files. Force it to treat the response
      // as a packed archive.
      const book = ePub(src, { openAs: "epub" });
      rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        spread: "auto",
      });
      renditionRef.current = rendition;

      try {
        await rendition.display();
        if (!cancelled) {
          setStatus("ready");
        }
      } catch (err) {
        console.error(`Failed to render EPUB "${title}"`, err);
        if (!cancelled) {
          setStatus("error");
        }
      }

      rendition.on("keyup", (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          rendition?.prev();
        } else if (event.key === "ArrowRight") {
          rendition?.next();
        }
      });
    })();

    return () => {
      cancelled = true;
      rendition?.destroy();
      renditionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      <div
        ref={viewerRef}
        className="h-full w-full flex-1"
        onContextMenu={(e) => e.preventDefault()}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading book…</p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background p-8 text-center">
          <p className="text-sm font-medium">
            This EPUB couldn&apos;t be loaded.
          </p>
          <p className="text-sm text-muted-foreground">
            The file may be corrupted or in an unsupported format.
          </p>
        </div>
      )}

      {status === "ready" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            className="absolute top-1/2 left-1 -translate-y-1/2"
            onClick={() => renditionRef.current?.prev()}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            className="absolute top-1/2 right-1 -translate-y-1/2"
            onClick={() => renditionRef.current?.next()}
          >
            <ChevronRight className="size-5" />
          </Button>
        </>
      )}
    </div>
  );
}
