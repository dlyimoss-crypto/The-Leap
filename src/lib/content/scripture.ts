import fs from "node:fs";
import path from "node:path";

export type ScripturePassage = {
  reference: string;
  translation: string;
  text: string;
};

const DATASET_PATH = path.join(
  process.cwd(),
  "content",
  "bible",
  "web",
  "faith-in-christ.json",
);

type RawEntry = { translation: string; text: string };

let dataset: Map<string, RawEntry> | null = null;

function loadDataset(): Map<string, RawEntry> {
  if (!dataset) {
    const raw = fs.readFileSync(DATASET_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, RawEntry>;
    dataset = new Map(Object.entries(parsed));
  }
  return dataset;
}

export function getScripture(reference: string): ScripturePassage | null {
  const entry = loadDataset().get(reference);
  if (!entry) {
    return null;
  }
  return { reference, translation: entry.translation, text: entry.text };
}

export function getScripturePassages(
  combinedReference: string,
): Array<{ reference: string; passage: ScripturePassage | null }> {
  return combinedReference.split(";").map((raw) => {
    const reference = raw.trim();
    return { reference, passage: getScripture(reference) };
  });
}

// The curated per-journey dataset only — not a full Bible (ticket 12).
export function listCuratedReferences(): string[] {
  return Array.from(loadDataset().keys());
}
