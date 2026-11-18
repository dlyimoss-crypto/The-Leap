import type { Locale } from "@/lib/i18n/locales";

/** Which language a piece of content is actually being shown in. */
export type Served = { servedLocale: Locale };

type FieldValue = string | string[] | null | undefined;

function isFilled(value: FieldValue): boolean {
  return Array.isArray(value) ? value.length > 0 : value != null && value !== "";
}

/**
 * Lays a published translation over its English source.
 *
 * All-or-nothing: if the translation is missing, or lacks text anywhere the
 * English has text (or has fewer prayer points), the whole item is served
 * in English, marked `servedLocale: "en"` so the page can say so. A
 * reader never gets half a devotion in one language and half in another.
 */
export function overlayTranslation<T extends object, K extends keyof T & string>(
  source: T,
  translation: Partial<Record<K, FieldValue>> | null | undefined,
  fields: readonly K[],
  locale: Locale,
): T & Served {
  if (locale === "en" || !translation) {
    return { ...source, servedLocale: "en" };
  }

  for (const field of fields) {
    const original = source[field] as FieldValue;
    const translated = translation[field];
    if (isFilled(original) && !isFilled(translated)) {
      return { ...source, servedLocale: "en" };
    }
    if (Array.isArray(original) && Array.isArray(translated) && translated.length < original.length) {
      return { ...source, servedLocale: "en" };
    }
  }

  const merged = { ...source } as T;
  for (const field of fields) {
    (merged as Record<string, unknown>)[field] = translation[field] ?? null;
  }
  return { ...merged, servedLocale: locale };
}
