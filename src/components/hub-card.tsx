import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HubCard({
  href,
  icon: Icon,
  title,
  description,
  comingSoon,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm hover:bg-muted/50"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold">{title}</p>
          {comingSoon && (
            <Badge variant="secondary" className="text-[9px]">
              Coming soon
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
