import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { InviteCard } from "./invite-card";

export default async function InvitePage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const dict = getDictionary(await getLocale());
  const t = dict.engage.invite;

  const firstName = profile?.display_name?.split(" ")[0] ?? null;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/engage" label={dict.nav.engage} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <InviteCard firstName={firstName} dict={t.card} />
    </main>
  );
}
