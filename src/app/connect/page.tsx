import { redirect } from "next/navigation";
import { Users, HeartHandshake, Church } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { createClient } from "@/lib/supabase/server";

export default async function ConnectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <BackLink href="/" label="Home" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">Connect</h1>
        <p className="text-sm text-muted-foreground">I belong.</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href="/community"
          icon={Users}
          title="Community"
          description="Encourage, share, and grow together."
        />
        <HubCard
          href="/prayer-room"
          icon={HeartHandshake}
          title="Prayer Room"
          description="Pray, support, and be prayed for."
        />
        <HubCard
          href="/connect/churches"
          icon={Church}
          title="Churches"
          description="Find a local church and connect with its community."
        />
      </div>
    </main>
  );
}
