import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { PatternCorner } from "@/components/pattern-bg";
import { GuestLanguageControls } from "@/components/language/guest-language-controls";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

// Code-composed welcome screen: a real DOM logo + heading instead of a
// baked photograph, so it stays sharp at every device resolution and loads
// instantly (no large JPEG to decode before anything is visible). Colors
// are hardcoded rather than theme tokens — this screen always renders on
// the fixed dark background below regardless of the visitor's light/dark
// system setting.
export async function WelcomeView() {
  const { welcome: dict, signIn } = getDictionary(await getLocale());

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden leap-backdrop-dark px-6 py-16 text-center">
      <PatternCorner corner="top-right" />
      <PatternCorner corner="bottom-left" />

      <div className="flex flex-col items-center gap-4">
        <BrandMark className="h-20 w-20" />
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
            {dict.title}
          </h1>
          <p className="max-w-xs text-sm text-white/70">
            {dict.tagline}
          </p>
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-3">
        <Button
          render={<Link href="/sign-in?mode=sign-up" />}
          nativeButton={false}
          size="lg"
          className="w-full"
        >
          {dict.getStarted}
        </Button>
        <Button
          render={<Link href="/sign-in" />}
          nativeButton={false}
          variant="link"
        >
          {dict.haveAccount}
        </Button>
        <Button
          render={<Link href="/forgot-password" />}
          nativeButton={false}
          variant="link"
          size="sm"
          className="text-white/70"
        >
          {signIn.forgotPassword}
        </Button>
      </div>

      <GuestLanguageControls className="mt-8 border-white/20 text-white/80" />
    </main>
  );
}
