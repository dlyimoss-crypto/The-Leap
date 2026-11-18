// Every Formation Journey — including "Faith in Christ", which used to ship as
// content-as-code — lives in the `journeys`/`journey_days` tables and is
// authored in admin. See journeys-repo.ts for loading.

import type { Locale } from "@/lib/i18n/locales";

export type JourneyMeta = {
  slug: string;
  domain: string;
  title: string;
  purpose: string;
  durationDays: number;
  completionTitle: string;
  // Short blurb for Home's dashboard cards — falls back to purpose when unset.
  teaser?: string | null;
  /** Language the text is in: "en" when no published translation exists. */
  servedLocale?: Locale;
};

export type JourneySession = {
  day: number;
  title: string;
  scriptureReference: string;
  message: string;
  explore: string;
  reflect: string;
  pray: string | null;
  nextTopic: string | null;
  servedLocale?: Locale;
};
