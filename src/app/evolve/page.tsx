import { BookOpen, Sparkles, Library } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";

export default async function EvolvePage() {
  await requireUser();

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label="Home" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">Evolve</h1>
        <p className="text-sm text-muted-foreground">I am becoming.</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/evolve/scripture"
          icon={BookOpen}
          title="Scripture"
          description="Read, search, study and save God's Word."
        />
        <HubCard
          href="/evolve/devotion"
          icon={Sparkles}
          title="Daily Devotion"
          description="Pause, reflect and encounter God in today's thought."
        />
        <HubCard
          href="/evolve/books"
          icon={Library}
          title="Books & Literature"
          description="Go deeper through books, teachings and curated resources."
        />
      </div>
    </main>
  );
}
