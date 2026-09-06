import { redirect } from "next/navigation";
import { HeartHandshake, Share2 } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { createClient } from "@/lib/supabase/server";

export default async function EngagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Engage</h1>
        <p className="text-sm text-muted-foreground">
          My life has a purpose beyond myself.
        </p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/engage/invite"
          icon={Share2}
          title="Invite a Friend"
          description="Help someone else take their first Leap."
        />
        <HubCard
          href="/engage/serve"
          icon={HeartHandshake}
          title="Serve & Missions"
          description="Find ways to serve and get involved."
        />
      </div>
    </main>
  );
}
