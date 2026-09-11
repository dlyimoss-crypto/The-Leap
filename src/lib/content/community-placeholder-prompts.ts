const FALLBACK_PROMPTS = [
  "Share what's on your mind…",
  "What's the Scripture that inspires you the most, and why?",
  "What has God been doing in your life this week?",
  "What's a prayer request you'd like this community to hold with you?",
  "What's one small thing you're grateful for today?",
  "Who could use some encouragement from you today?",
  "What's a truth you're holding onto right now?",
  "What's a lesson your faith has taught you recently?",
  "What verse has carried you through a hard season?",
  "How did you see God show up this week?",
  "What's a small win worth celebrating today?",
  "What's something you're learning to trust Him with?",
  "What would you say to someone who's struggling right now?",
  "What's a prayer that's been answered lately?",
] as const;

// Deterministic per day (UTC) so every visitor sees the same suggestion,
// consistent with the date-keyed community-prompt content files.
export function getCommunityPlaceholder(date: Date): string {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86_400_000,
  );
  return FALLBACK_PROMPTS[dayOfYear % FALLBACK_PROMPTS.length];
}
