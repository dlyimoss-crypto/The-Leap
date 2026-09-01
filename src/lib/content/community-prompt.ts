import path from "node:path";
import { safeReadJson } from "./safe-read-json";

const PROMPTS_ROOT = path.join(process.cwd(), "content", "community-prompts");
const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function getCommunityPrompt(date: string): string | null {
  const entry = safeReadJson<{ prompt: string }>(
    PROMPTS_ROOT,
    VALID_DATE,
    date,
    (d) => `${d}.json`,
  );
  return entry?.prompt ?? null;
}
