import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/pattern-bg";
import { getAuthedUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage(props: PageProps<"/sign-in">) {
  // Someone with a valid session who ends up here (a stale link, the back
  // button, tapping "I already have an account" while already signed in)
  // already proved who they are — don't ask again.
  const { user } = await getAuthedUser();
  if (user) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const modeParam = Array.isArray(searchParams.mode)
    ? searchParams.mode[0]
    : searchParams.mode;
  const initialMode = modeParam === "sign-up" ? "sign-up" : "sign-in";
  const dict = getDictionary(await getLocale());

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
      <PatternBorder />
      <SignInForm initialMode={initialMode} dict={dict.signIn} />
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        variant="ghost"
        size="sm"
      >
        {dict.signIn.back}
      </Button>
    </main>
  );
}
