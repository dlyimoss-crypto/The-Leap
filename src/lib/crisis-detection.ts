export type CrisisCheckResult =
  | { flagged: false }
  | { flagged: true; matchedTerm: string };

const CRISIS_TERMS = [
  "suicide",
  "hurting myself",
  "being abused",
  "immediate danger",
  "don't want to be here anymore",
];

export function checkForCrisisLanguage(text: string): CrisisCheckResult {
  const lowered = text.toLowerCase().replace(/[‘’]/g, "'");
  const matchedTerm = CRISIS_TERMS.find((term) => lowered.includes(term));
  if (matchedTerm) {
    return { flagged: true, matchedTerm };
  }
  return { flagged: false };
}
