import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <BrandMark className="h-10 w-10" />
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">
          There&apos;s no next step here.
        </h1>
        <p className="max-w-sm text-muted-foreground">
          This page doesn&apos;t exist, but wherever you are, there&apos;s
          still a next step waiting.
        </p>
      </div>
      <Button render={<Link href="/" />} nativeButton={false} size="lg">
        Back to The Leap
      </Button>
    </main>
  );
}
