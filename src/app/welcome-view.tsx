import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function WelcomeView() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Logo size="lg" />

      <div className="space-y-2">
        <h1 className="text-lg font-medium text-foreground">
          Your Essential Companion in Christ
        </h1>
        <p className="text-muted-foreground">Take your next step with Christ.</p>
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Button
          render={<Link href="/journeys/faith-in-christ" />}
          nativeButton={false}
          size="lg"
          className="w-full"
        >
          Get Started
        </Button>
        <Button
          render={<Link href="/sign-in" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          I already have an account
        </Button>
      </div>
    </main>
  );
}
