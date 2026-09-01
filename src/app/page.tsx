import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        The Leap
      </p>
      <h1 className="font-heading text-4xl font-bold text-balance">
        Your essential companion in Christ
      </h1>
      <p className="max-w-md text-muted-foreground">
        Scaffold is live — stack, schema, and design tokens wired up. The
        real Home screen ships next.
      </p>
      <Button>Continue journey</Button>
    </div>
  );
}
