import { Gift, Landmark, Smartphone, Receipt } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";

const GIVING_METHODS = [
  { icon: Landmark, label: "International Bank Transfer" },
  { icon: Landmark, label: "Tanzanian Bank Transfer" },
  { icon: Smartphone, label: "Mobile Pesa" },
  { icon: Receipt, label: "US Tax-Deductible Giving" },
];

const CORE_VALUES = [
  "Integrity",
  "Service",
  "Wisdom",
  "Discipline",
  "Excellence",
];

export default async function GivePage() {
  await requireUser();

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/engage" label="Engage" />

      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Gift className="size-7" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-balance">
          Get Involved. Take Part. Make a Difference.
        </h1>
        <p className="text-sm text-muted-foreground">
          Your support helps The Leap help people take their next step with
          Christ. We welcome your partnership through giving, serving,
          praying and connecting others to the mission.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          How can I give?
        </h2>
        <div className="space-y-2">
          {GIVING_METHODS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border bg-card p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-4" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          For full giving details, visit our Give Page.
        </p>
      </div>

      <div className="mt-auto flex flex-col items-center gap-1.5 pt-6 text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {CORE_VALUES.join(" · ")}
        </p>
        <p className="font-heading text-sm font-semibold">
          Together, we take the next step.
        </p>
      </div>
    </main>
  );
}
