import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon className="size-8 text-muted-foreground/50" />
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
