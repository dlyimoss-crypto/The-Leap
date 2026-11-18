// The rotating composer placeholders themselves are interface text and live
// in the i18n dictionary (community.composer.placeholderPrompts); this only
// picks today's one.

// Deterministic per day (UTC) so every visitor sees the same suggestion,
// consistent with the date-keyed community-prompt content files.
export function getCommunityPlaceholder(
  date: Date,
  prompts: readonly string[],
): string {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86_400_000,
  );
  return prompts[dayOfYear % prompts.length];
}
