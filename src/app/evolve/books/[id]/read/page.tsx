import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { getReadableManuscript } from "../../manuscript-access";
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

  const isPdf = manuscript.filename.toLowerCase().endsWith(".pdf");

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b bg-card px-4 py-2.5">
        <BackLink href={`/evolve/books/${id}`} label="Back" />
        <p className="truncate text-sm font-medium">{book?.title}</p>
      </div>

      {isPdf ? (
        <PdfFrame
          src={`/evolve/books/${id}/read/file#toolbar=0`}
          title={book?.title ?? "Book"}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-sm font-medium">
            This file format can&apos;t be previewed in-app yet.
          </p>
          <p className="text-sm text-muted-foreground">
            We currently support reading PDF manuscripts inline.
          </p>
        </div>
      )}
    </main>
  );
}
