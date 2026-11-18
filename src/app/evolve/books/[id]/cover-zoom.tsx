"use client";

import { Library } from "lucide-react";
import { interpolate } from "@/lib/i18n/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CoverZoom({
  coverUrl,
  title,
  viewLargerCoverTemplate,
  coverAltTemplate,
}: {
  coverUrl: string | null;
  title: string;
  /** "View larger cover for {title}" */
  viewLargerCoverTemplate: string;
  /** "{title} cover" */
  coverAltTemplate: string;
}) {
  const coverAlt = interpolate(coverAltTemplate, { title });

  if (!coverUrl) {
    return (
      <div className="flex aspect-[3/4] w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Library className="size-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        className="aspect-[3/4] w-28 shrink-0 cursor-zoom-in overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={interpolate(viewLargerCoverTemplate, { title })}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverUrl} alt="" className="size-full object-cover" />
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="flex max-w-sm items-center justify-center bg-transparent p-0 ring-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">{coverAlt}</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={coverAlt}
          className="max-h-[80vh] w-full rounded-xl object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
