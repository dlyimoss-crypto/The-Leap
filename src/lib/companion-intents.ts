import {
  BookOpen,
  Sparkles,
  Compass,
  Library,
  Flower2,
  type LucideIcon,
} from "lucide-react";

export type CompanionIntent = {
  slug: string;
  label: string;
  icon: LucideIcon;
  message: string;
};

// Seed messages are phrased as the user's own request — Companion
// facilitates, it never leads or claims spiritual authority (CONTEXT.md).
export const COMPANION_INTENTS: CompanionIntent[] = [
  {
    slug: "new-believer",
    label: "I just prayed to receive Jesus",
    icon: Flower2,
    message:
      "I just prayed to receive Jesus. Where do I begin? I'm not sure yet whether I'm just beginning to follow Jesus, want to understand the Bible, want to learn how to pray, want to grow in my faith, or just have questions about Jesus — can you help me figure out where to start?",
  },
  {
    slug: "scripture",
    label: "Help me understand Scripture",
    icon: BookOpen,
    message: "Can you help me understand today's Scripture?",
  },
  {
    slug: "devotion",
    label: "Reflect on today's devotion",
    icon: Sparkles,
    message: "Can you help me reflect on today's devotion?",
  },
  {
    slug: "next-step",
    label: "Help me take my next step",
    icon: Compass,
    message: "What's my next step?",
  },
  {
    slug: "materials",
    label: "Get Christian materials",
    icon: Library,
    message: "Can you recommend some Christian books or materials for me?",
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
