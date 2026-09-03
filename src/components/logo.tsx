import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

/**
 * Mark + "THE LEAP" wordmark, for prominent placements (splash/welcome
 * screen, marketing surfaces). For small in-app spots, use BrandMark
 * alone instead.
 */
export function Logo({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const isLarge = size === "lg";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isLarge && "flex-col gap-4",
        className,
      )}
    >
      <BrandMark
        className={cn("shrink-0", isLarge ? "h-20 w-20" : "h-10 w-10")}
      />
      <span
        className={cn(
          "font-heading font-bold tracking-[0.15em] text-foreground",
          isLarge ? "text-3xl" : "text-2xl",
        )}
      >
        THE LEAP
      </span>
    </div>
  );
}
