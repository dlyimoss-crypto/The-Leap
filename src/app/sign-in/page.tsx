import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-heading font-semibold">Sign in</h1>
      <p className="max-w-sm text-muted-foreground">
        Sign-in isn&apos;t wired up yet — it needs the Supabase project to be
        connected first. Come back once that&apos;s set up.
      </p>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        variant="ghost"
        size="sm"
      >
        Back
      </Button>
    </main>
  );
}
