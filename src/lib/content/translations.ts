export type Translation = {
  code: string;
  label: string;
  available: boolean;
};

// Only the BSB is actually ingested today (the whole Bible, replacing the
// earlier curated WEB passages). KJV/ASV are listed now so the Scripture
// translation picker is a config addition later, not a UI rewrite, per
// ticket 12's "extensible list" decision.
export const TRANSLATIONS: Translation[] = [
  { code: "BSB", label: "Berean Standard Bible", available: true },
  { code: "KJV", label: "King James Version", available: false },
  { code: "ASV", label: "American Standard Version", available: false },
];
