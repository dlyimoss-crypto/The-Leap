import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { AvatarCropper } from "./avatar-cropper";
import { updateDisplayName } from "./actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <div>
        <h1 className="text-2xl font-heading font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your photo and name.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <AvatarCropper
          displayName={profile?.display_name ?? null}
          avatarUrl={profile?.avatar_url ?? null}
        />
      </div>

      <form
        action={updateDisplayName}
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Save
          </Button>
        </div>
      </form>
    </main>
  );
}
