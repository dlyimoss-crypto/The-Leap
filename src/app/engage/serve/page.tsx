import { redirect } from "next/navigation";
import { HeartHandshake, Mail, MapPin } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { createClient } from "@/lib/supabase/server";

type OpportunityRow = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  link: string | null;
};

export default async function ServePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: opportunities, error } = await supabase
    .from("service_opportunities")
    .select(
      "id, title, category, description, location, contact_email, contact_phone, link",
    )
    .order("created_at", { ascending: false })
    .returns<OpportunityRow[]>();

  if (error) {
    console.error("Failed to load service opportunities", error);
  }

  const rows = opportunities ?? [];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Serve & Missions
        </h1>
        <p className="text-sm text-muted-foreground">
          Find ways to serve and get involved.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <HeartHandshake className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No opportunities listed yet — check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((opportunity) => (
            <div
              key={opportunity.id}
              className="space-y-3 rounded-xl border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <HeartHandshake className="size-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  {opportunity.category && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {opportunity.category}
                    </p>
                  )}
                  <p className="font-heading font-semibold text-balance">
                    {opportunity.title}
                  </p>
                </div>
              </div>

              {opportunity.description && (
                <p className="text-sm text-foreground">
                  {opportunity.description}
                </p>
              )}

              <div className="space-y-2 border-t pt-3 text-sm">
                {opportunity.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>{opportunity.location}</span>
                  </div>
                )}
                {opportunity.contact_phone && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 shrink-0 text-center text-muted-foreground">
                      📞
                    </span>
                    <CopyButton value={opportunity.contact_phone} />
                  </div>
                )}
                {opportunity.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`mailto:${opportunity.contact_email}`}
                      className="text-sm text-primary underline"
                    >
                      {opportunity.contact_email}
                    </a>
                  </div>
                )}
                {opportunity.link && (
                  <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium text-primary underline"
                  >
                    Learn more
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
