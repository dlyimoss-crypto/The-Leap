import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getReadableManuscript } from "../../manuscript-access";
import { EpubFrame } from "./epub-frame";
import { PdfFrame } from "./pdf-frame";

export default async function BookReadPage(
  props: PageProps<"/evolve/books/[id]/read">,
) {
  const { id } = await props.params;
  const manuscript = await getReadableManuscript(id);

  if (!manuscript) {
    notFound();
  }

  const { data: book } = await manuscript.supabase
    .from("books")
    .select("title")
    .eq("id", id)
    .single<{ title: string }>();

  const t = getDictionary(await getLocale()).books.reader;
  const isEpub = manuscript.filename.toLowerCase().endsWith(".epub");

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b bg-card px-4 py-2.5">
        <BackLink href={`/evolve/books/${id}`} label={t.back} />
        <p className="truncate text-sm font-medium">{book?.title}</p>
      </div>

      {isEpub ? (
        <EpubFrame
          src={`/evolve/books/${id}/read/file`}
          title={book?.title ?? t.untitled}
          dict={t}
        />
      ) : (
        <PdfFrame
          src={`/evolve/books/${id}/read/file`}
          title={book?.title ?? t.untitled}
          dict={t}
        />
      )}
    </main>
  );
}
