import {
  BookOpen,
  Sparkles,
  Compass,
  Library,
  Flower2,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type CompanionIntentSlug =
  keyof Dictionary["engage"]["companion"]["intentMessages"];

export type CompanionIntent = {
  slug: CompanionIntentSlug;
  /** English fallback; the menu shows dict.companion.intents[slug]. */
  label: string;
  icon: LucideIcon;
};

// Each intent's seed message lives in the dictionary
// (engage.companion.intentMessages), phrased as the user's own request —
// Companion facilitates, it never leads or claims spiritual authority
// (CONTEXT.md).
export const COMPANION_INTENTS: CompanionIntent[] = [
  {
    slug: "new-believer",
    label: "I just prayed to receive Jesus",
    icon: Flower2,
  },
  {
    slug: "scripture",
    label: "Help me understand Scripture",
    icon: BookOpen,
  },
  {
    slug: "devotion",
    label: "Reflect on today's devotion",
    icon: Sparkles,
  },
  {
    slug: "next-step",
    label: "Help me take my next step",
    icon: Compass,
  },
  {
    slug: "materials",
    label: "Get Christian materials",
    icon: Library,
  },
];

export function getCompanionIntent(
  slug: string | undefined,
): CompanionIntent | null {
  if (!slug) {
    return null;
  }
  return COMPANION_INTENTS.find((intent) => intent.slug === slug) ?? null;
}
