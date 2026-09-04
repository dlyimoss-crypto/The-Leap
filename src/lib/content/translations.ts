export type Translation = {
  code: string;
  label: string;
  available: boolean;
};

// Only WEB is actually ingested today (ticket 03). KJV/ASV are listed now so
// the Scripture translation picker is a config addition later, not a UI
// rewrite, per ticket 12's "extensible list" decision.
export const TRANSLATIONS: Translation[] = [
  { code: "WEB", label: "World English Bible", available: true },
  { code: "KJV", label: "King James Version", available: false },
  { code: "ASV", label: "American Standard Version", available: false },
];
