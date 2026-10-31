// Every Formation Journey — including "Faith in Christ", which used to ship as
// content-as-code — lives in the `journeys`/`journey_days` tables and is
// authored in admin. See journeys-repo.ts for loading.

export type JourneyMeta = {
  slug: string;
  domain: string;
  title: string;
  purpose: string;
  durationDays: number;
  completionTitle: string;
  // Short blurb for Home's dashboard cards — falls back to purpose when unset.
  teaser?: string | null;
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
};
