import path from "node:path";
import { safeReadJson } from "./safe-read-json";

export type JourneyMeta = {
  slug: string;
  domain: string;
  title: string;
  purpose: string;
  durationDays: number;
  completionTitle: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "en");
const VALID_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function getJourneyMeta(slug: string): JourneyMeta | null {
  return safeReadJson<JourneyMeta>(CONTENT_ROOT, VALID_SLUG, slug, (s) =>
    path.join(s, "meta.json"),
  );
}

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

export function getJourneySession(
  slug: string,
  day: number,
): JourneySession | null {
  return safeReadJson<JourneySession>(CONTENT_ROOT, VALID_SLUG, slug, (s) =>
    path.join(s, `day-${day}.json`),
  );
}
