import { BookOpen, Sparkles, Library } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function EvolvePage() {
  await requireUser();
  const dict = getDictionary(await getLocale());
  const t = dict.evolve.hub;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label={dict.nav.home} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">{dict.nav.evolve}</h1>
        <p className="text-sm text-muted-foreground">{t.tagline}</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/evolve/scripture"
          icon={BookOpen}
          title={t.scriptureTitle}
          description={t.scriptureDescription}
        />
        <HubCard
          href="/evolve/devotion"
          icon={Sparkles}
          title={t.devotionTitle}
          description={t.devotionDescription}
        />
        <HubCard
          href="/evolve/books"
          icon={Library}
          title={t.booksTitle}
          description={t.booksDescription}
        />
      </div>
    </main>
  );
}
