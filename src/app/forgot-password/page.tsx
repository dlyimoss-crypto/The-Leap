import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/pattern-bg";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ForgotPasswordForm } from "./forgot-password-form";

export default async function ForgotPasswordPage(
  props: PageProps<"/forgot-password">,
) {
  const searchParams = await props.searchParams;
  // /auth/confirm sends people back here when their emailed link was bad.
  const linkInvalid = searchParams.error === "link";
  const dict = getDictionary(await getLocale());

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
      <PatternBorder />
      <ForgotPasswordForm dict={dict.signIn} linkInvalid={linkInvalid} />
      <Button
        render={<Link href="/sign-in" />}
        nativeButton={false}
        variant="ghost"
        size="sm"
      >
        {dict.signIn.backToSignIn}
      </Button>
    </main>
  );
}
