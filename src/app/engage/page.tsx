import { Gift, HeartHandshake, Share2 } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function EngagePage() {
  await requireUser();
  const dict = getDictionary(await getLocale());
  const t = dict.engage.hub;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label={dict.nav.home} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">{dict.nav.engage}</h1>
        <p className="text-sm text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/engage/invite"
          icon={Share2}
          title={t.inviteTitle}
          description={t.inviteDescription}
        />
        <HubCard
          href="/engage/serve"
          icon={HeartHandshake}
          title={t.serveTitle}
          description={t.serveDescription}
        />
        <HubCard
          href="/engage/give"
          icon={Gift}
          title={t.giveTitle}
          description={t.giveDescription}
          comingSoon
          comingSoonLabel={dict.commit.hubCard.comingSoon}
        />
      </div>
    </main>
  );
}
