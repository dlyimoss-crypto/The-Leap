"use client";

export function PdfFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      className="h-full w-full flex-1 border-0"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
