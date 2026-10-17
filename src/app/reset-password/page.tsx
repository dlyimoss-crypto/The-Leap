import { redirect } from "next/navigation";
import { PatternBorder } from "@/components/pattern-bg";
import { getAuthedUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  // Reached through /auth/confirm, which signs the person in from their
  // emailed link. No session means the link was never used (or expired).
  const { user } = await getAuthedUser();
  if (!user) {
    redirect("/forgot-password?error=link");
  }

  const dict = getDictionary(await getLocale());

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
      <PatternBorder />
      <ResetPasswordForm dict={dict.signIn} />
    </main>
  );
}
