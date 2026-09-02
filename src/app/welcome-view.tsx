import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeapMark } from "@/components/leap-mark";

export function WelcomeView() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <LeapMark className="h-16 w-16 text-primary" />

      <div className="space-y-3">
        <h1 className="text-4xl font-heading font-semibold tracking-tight text-balance">
          Your journey matters.
        </h1>
        <p className="max-w-sm text-muted-foreground text-lg">
          Life is a journey. Faith is a journey. You don&apos;t have to walk
          it alone.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Button
          render={<Link href="/journeys/faith-in-christ" />}
          nativeButton={false}
          size="lg"
          className="w-full"
        >
          Begin my journey
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
