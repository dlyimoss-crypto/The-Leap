import { HeartHandshake, Church, MessageCircle, UserRound } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ConnectPage() {
  await requireUser();
  const t = getDictionary(await getLocale()).commit.connectPage;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label={t.backToHome} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">{t.heading}</h1>
        <p className="text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/prayer-room"
          icon={HeartHandshake}
          title={t.prayerRoomTitle}
          description={t.prayerRoomDescription}
        />
        <HubCard
          href="/connect/churches"
          icon={Church}
          title={t.churchesTitle}
          description={t.churchesDescription}
        />
        <HubCard
          href="/ask-pd"
          icon={UserRound}
          title={t.askPdTitle}
          description={t.askPdDescription}
        />
        <HubCard
          href="/companion"
          icon={MessageCircle}
          title={t.companionTitle}
          description={t.companionDescription}
        />
      </div>
    </main>
  );
}
