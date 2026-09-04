import { redirect } from "next/navigation";
import { Flag } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { createClient } from "@/lib/supabase/server";

export default async function CommitPage() {
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
        icon={Flag}
        title="Commit"
        description="Commit is on its way — check back soon."
      />
    </main>
  );
}
