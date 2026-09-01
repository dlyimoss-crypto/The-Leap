import fs from "node:fs";
import path from "node:path";

export type JourneyMeta = {
  slug: string;
  domain: string;
  title: string;
  purpose: string;
  durationDays: number;
  completionTitle: string;
  nextRecommendations: string[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "en");
const VALID_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function readContentJson<T>(...segments: string[]): T | null {
  if (!VALID_SLUG.test(segments[0])) {
    return null;
  }
  const filePath = path.join(CONTENT_ROOT, ...segments);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getJourneyMeta(slug: string): JourneyMeta | null {
  return readContentJson<JourneyMeta>(slug, "meta.json");
}

export type JourneySession = {
  day: number;
  title: string;
  scriptureReference: string;
  explore: string;
  reflect: string;
  pray: string | null;
  practice: string;
  connect: string;
  nextTopic: string | null;
};

export function getJourneySession(
  slug: string,
  day: number,
): JourneySession | null {
  return readContentJson<JourneySession>(slug, `day-${day}.json`);
}
