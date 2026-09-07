import { getReadableManuscript } from "../../../manuscript-access";

/**
 * Streams the manuscript bytes through our own origin instead of redirecting
 * to Supabase Storage's signed URL — so the URL a reader could copy out of
 * the network tab or address bar is same-origin and worthless outside this
 * request, not a bearer link to the file that works for the next 5 minutes
 * from anywhere. Content-Disposition stays "inline" (never "attachment") so
 * this renders in the embedded viewer rather than triggering a save dialog.
 *
 * This raises the bar against casual downloading; it doesn't defeat someone
 * determined enough to use devtools or print-to-PDF. There's no real DRM
 * here, and there isn't meant to be one for a $0 book.
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/evolve/books/[id]/read/file">,
) {
  const { id } = await ctx.params;
  const manuscript = await getReadableManuscript(id);

  if (!manuscript) {
    return new Response("Not found", { status: 404 });
  }

  const { supabase, path, filename } = manuscript;

  const { data: signed, error } = await supabase.storage
    .from("book-manuscripts")
    .createSignedUrl(path, 60);

  if (error || !signed) {
    return new Response("Unavailable", { status: 502 });
  }

  const upstream = await fetch(signed.signedUrl);
  if (!upstream.ok || !upstream.body) {
    return new Response("Unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/pdf",
      "Content-Disposition": `inline; filename="${filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
