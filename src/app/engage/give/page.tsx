import { Gift, Landmark, Smartphone, Receipt } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const GIVING_METHODS = [
  { icon: Landmark, key: "internationalBank" },
  { icon: Landmark, key: "tanzanianBank" },
  { icon: Smartphone, key: "mobilePesa" },
  { icon: Receipt, key: "usTaxDeductible" },
] as const;

const CORE_VALUES = [
  "integrity",
  "service",
  "wisdom",
  "discipline",
  "excellence",
] as const;

export default async function GivePage() {
  await requireUser();
  const dict = getDictionary(await getLocale());
  const t = dict.engage.give;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/engage" label={dict.nav.engage} />

      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Gift className="size-7" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-balance">
          {t.heading}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.intro}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t.howCanIGive}
        </h2>
        <div className="space-y-2">
          {GIVING_METHODS.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl border bg-card p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-4" />
              </div>
              <span className="text-sm font-medium">{t.methods[key]}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {t.fullDetails}
        </p>
      </div>

      <div className="mt-auto flex flex-col items-center gap-1.5 pt-6 text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {CORE_VALUES.map((key) => t.coreValues[key]).join(" · ")}
        </p>
        <p className="font-heading text-sm font-semibold">
          {t.together}
        </p>
      </div>
    </main>
  );
}
