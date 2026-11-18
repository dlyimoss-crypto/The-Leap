import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function NotFound() {
  const t = getDictionary(await getLocale()).common.notFound;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <BrandMark className="h-10 w-10" />
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">{t.title}</h1>
        <p className="max-w-sm text-muted-foreground">
          {t.body}
        </p>
      </div>
      <Button render={<Link href="/" />} nativeButton={false} size="lg">
        {t.backToTheLeap}
      </Button>
    </main>
  );
}
