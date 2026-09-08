import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { AvatarCropper } from "./avatar-cropper";
import { updateDisplayName, updatePreferredLanguage } from "./actions";

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, preferred_language")
    .eq("id", user.id)
    .single();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {dict.profile.backToHome}
      </Link>

      <div>
        <h1 className="text-2xl font-heading font-semibold">
          {dict.profile.heading}
        </h1>
        <p className="text-sm text-muted-foreground">
          {dict.profile.subheading}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <AvatarCropper
          displayName={profile?.display_name ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          dict={dict.profile}
        />
      </div>

      <form
        action={updateDisplayName}
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="display_name">{dict.profile.displayNameLabel}</Label>
          <Input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            {dict.profile.save}
          </Button>
        </div>
      </form>

      <div className="space-y-2 rounded-xl border bg-card p-4">
        <p className="text-sm font-medium">{dict.profile.language}</p>
        <div className="flex gap-2">
          <form action={updatePreferredLanguage}>
            <input type="hidden" name="preferred_language" value="en" />
            <Button
              type="submit"
              size="sm"
              variant={locale === "en" ? "default" : "outline"}
            >
              {dict.profile.english}
            </Button>
          </form>
          <form action={updatePreferredLanguage}>
            <input type="hidden" name="preferred_language" value="sw" />
            <Button
              type="submit"
              size="sm"
              variant={locale === "sw" ? "default" : "outline"}
            >
              {dict.profile.swahili}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
