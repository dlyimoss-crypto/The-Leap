import { Languages } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Says so when a devotion / journey / announcement is being shown in its
 * English original because no translation into the reader's language is
 * published yet — so English never appears silently under a German (etc.)
 * interface. Renders nothing when the content is in the reader's language.
 */
export async function TranslationNotice({ servedLocale }: { servedLocale?: Locale }) {
  const locale = await getLocale();
  if (!servedLocale || servedLocale === locale) return null;

  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"
    >
      <Languages aria-hidden className="mt-px size-3.5 shrink-0" />
      <span>{getDictionary(locale).common.notTranslated}</span>
    </p>
  );
}
