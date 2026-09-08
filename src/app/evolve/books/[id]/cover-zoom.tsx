"use client";

import { Library } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CoverZoom({
  coverUrl,
  title,
}: {
  coverUrl: string | null;
  title: string;
}) {
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
        aria-label={`View larger cover for ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverUrl} alt="" className="size-full object-cover" />
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="flex max-w-sm items-center justify-center bg-transparent p-0 ring-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">{title} cover</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={`${title} cover`}
          className="max-h-[80vh] w-full rounded-xl object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
