import {
  HandHeart,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Compass,
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
    slug: "pray",
    label: "Pray with me",
    icon: HandHeart,
    message: "Will you help me pray about what's on my heart right now?",
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
    slug: "apply",
    label: "Help me apply this",
    icon: CheckCircle2,
    message: "Can you help me apply what I'm learning to my life right now?",
  },
  {
    slug: "encourage",
    label: "Encourage me",
    icon: HeartHandshake,
    message: "I could use some encouragement right now.",
  },
  {
    slug: "next-step",
    label: "Help me take my next step",
    icon: Compass,
    message: "What's my next step?",
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
