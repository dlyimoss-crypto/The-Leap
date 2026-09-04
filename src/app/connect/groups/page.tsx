import { redirect } from "next/navigation";
import { Users2 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { createClient } from "@/lib/supabase/server";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <ComingSoon
        icon={Users2}
        title="Groups"
        description="Groups are coming soon. In the meantime, connect in Community or the Prayer Room."
      />
    </main>
  );
}
