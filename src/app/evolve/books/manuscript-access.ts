import { requireUser } from "@/lib/supabase/authorize";

/**
 * Single source of truth for "can the current user read this manuscript" —
 * used by both the reader page (to decide whether to render it) and the
 * byte-streaming route (to decide whether to actually serve the file), so
 * the two checks can't drift apart. Only published, free books qualify;
 * paid books have no purchase flow yet, so they stay closed.
 */
export async function getReadableManuscript(bookId: string) {
  const { supabase } = await requireUser();

  const { data: book } = await supabase
    .from("books")
    .select("manuscript_path, manuscript_filename, status, price_cents")
    .eq("id", bookId)
    .maybeSingle<{
      manuscript_path: string | null;
      manuscript_filename: string | null;
      status: string;
      price_cents: number | null;
    }>();

  if (
    !book?.manuscript_path ||
    book.status !== "published" ||
    book.price_cents !== null
  ) {
    return null;
  }

  return {
    supabase,
    path: book.manuscript_path,
    filename: book.manuscript_filename ?? "book.pdf",
  };
}
