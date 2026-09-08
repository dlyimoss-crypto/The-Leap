import { Gift } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";

export default async function GivePage() {
  await requireUser();

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/engage" label="Engage" />
      <ComingSoon
        icon={Gift}
        title="Giving"
        description="Support The Leap and the ministries it partners with — coming soon."
      />
    </main>
  );
}
