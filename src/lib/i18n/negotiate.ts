import type { Locale } from "./locales";

/** Maps one BCP 47 language tag onto our locale codes, or null. */
function toLocale(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  const primary = lower.split("-")[0];

  // Only Simplified Chinese is offered; Traditional Chinese readers
  // (zh-TW/HK/Hant) are offered it too — as a suggestion, never forced.
  if (primary === "zh") {
    return "zh-CN";
  }
  if (primary === "en" || primary === "sw" || primary === "de" || primary === "fr" || primary === "es") {
    return primary;
  }
  return null;
}

/**
 * The device's most-preferred language that's in `allowed`, read from an
 * Accept-Language header — or null if none of them is. Used to *suggest* a
 * language, never to force one.
 */
export function localeFromAcceptLanguage(
  header: string | null,
  allowed: readonly Locale[],
): Locale | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim(), q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(({ tag, q }) => tag && tag !== "*" && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    const locale = toLocale(tag);
    if (locale && allowed.includes(locale)) return locale;
  }
  return null;
}
