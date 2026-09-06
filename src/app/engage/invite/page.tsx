import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteCard } from "./invite-card";

export default async function InvitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.display_name?.split(" ")[0] ?? null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Invite a Friend
        </h1>
        <p className="text-sm text-muted-foreground">
          Multiply — help someone else take their next step.
        </p>
      </div>

      <InviteCard firstName={firstName} />
    </main>
  );
}
