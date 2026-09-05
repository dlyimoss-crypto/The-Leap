import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Church, Mail, MapPin, Users2 } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { createClient } from "@/lib/supabase/server";

type ChurchRow = {
  id: string;
  name: string;
  lead_pastor: string | null;
  mission: string | null;
  address: string | null;
  service_time: string | null;
  phone: string | null;
  email: string | null;
  member_count_estimate: number | null;
};

export default async function ChurchesPage(
  props: PageProps<"/connect/churches">,
) {
  const searchParams = await props.searchParams;
  const idParam = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: churches } = await supabase
    .from("churches")
    .select(
      "id, name, lead_pastor, mission, address, service_time, phone, email, member_count_estimate",
    )
    .order("name", { ascending: true })
    .returns<ChurchRow[]>();

  const rows = churches ?? [];

  // With only one church in the directory, skip the list entirely and show
  // its card directly — a list-of-one adds a tap for no reason.
  const selectedId = idParam ?? (rows.length === 1 ? rows[0].id : undefined);
  const showBackLink = rows.length > 1;

  if (selectedId) {
    const church = rows.find((c) => c.id === selectedId);

    if (!church) {
      return (
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
          <Link
            href="/connect/churches"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Churches
          </Link>
          <p className="text-sm text-muted-foreground">
            This church listing couldn&apos;t be found.
          </p>
        </main>
      );
    }

    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
        {showBackLink && (
          <Link
            href="/connect/churches"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Churches
          </Link>
        )}

        <div className="space-y-4 rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Church className="size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-heading font-semibold text-balance">
                {church.name}
              </h1>
              {church.lead_pastor && (
                <p className="text-sm text-muted-foreground">
                  Lead Pastor: {church.lead_pastor}
                </p>
              )}
            </div>
          </div>

          {church.mission && (
            <p className="text-sm text-foreground">{church.mission}</p>
          )}

          <div className="space-y-2 border-t pt-3 text-sm">
            {church.address && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{church.address}</span>
              </div>
            )}
            {church.service_time && (
              <div className="flex items-start gap-2">
                <span className="w-4 shrink-0 text-center text-muted-foreground">
                  🕒
                </span>
                <span>Service: {church.service_time}</span>
              </div>
            )}
            {church.phone && (
              <div className="flex items-center gap-2">
                <span className="w-4 shrink-0 text-center text-muted-foreground">
                  📞
                </span>
                <CopyButton value={church.phone} />
              </div>
            )}
            {church.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`mailto:${church.email}`}
                  className="text-sm text-primary underline"
                >
                  {church.email}
                </a>
              </div>
            )}
            {church.member_count_estimate != null && (
              <div className="flex items-center gap-2">
                <Users2 className="size-4 shrink-0 text-muted-foreground" />
                <span>~{church.member_count_estimate} members</span>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Churches</h1>
        <p className="text-sm text-muted-foreground">
          Find a local church and connect with its community.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Church className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No churches listed yet — check back soon.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {rows.map((church) => (
            <Link
              key={church.id}
              href={`/connect/churches?id=${church.id}`}
              className="flex items-center gap-3 p-4 hover:bg-muted/50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Church className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{church.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {church.lead_pastor ? `${church.lead_pastor} · ` : ""}
                  {church.service_time ?? "Service time not listed"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
