import fs from "node:fs";
import path from "node:path";

/**
 * Reads and parses a JSON file under `root`, at the relative path
 * `buildRelativePath(key)`. Returns null (rather than throwing) if `key`
 * doesn't match `keyPattern` or the resulting file doesn't exist — the
 * same "not found" outcome for both a missing file and an unsafe or
 * malformed key, since `key` is the only untrusted input.
 *
 * `buildRelativePath` runs only after validation, so it's free to shape
 * the path however the content layout needs (a `<key>/file.json`
 * directory, a flat `<key>.json` file, etc.) without re-deriving or
 * re-checking the key itself.
 */
export function safeReadJson<T>(
  root: string,
  keyPattern: RegExp,
  key: string,
  buildRelativePath: (key: string) => string,
): T | null {
  if (!keyPattern.test(key)) {
    return null;
  }
  const filePath = path.join(root, buildRelativePath(key));
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}
