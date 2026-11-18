import { ENABLED_LOCALES, getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale, getSuggestedLocale } from "@/lib/i18n/get-locale";
import { LOCALE_INFO } from "@/lib/i18n/locales";
import { LanguagePicker } from "./language-picker";
import { LanguageSuggestion } from "./language-suggestion";

/**
 * Language choice on the screens before sign-in (welcome, sign-in/up):
 * the one-time device-language offer if there is one, otherwise the
 * dropdown. Whatever is chosen here is carried into a new account at
 * sign-up.
 */
export async function GuestLanguageControls({ className }: { className?: string }) {
  const [locale, suggested] = await Promise.all([getLocale(), getSuggestedLocale()]);

  if (suggested) {
    return <LanguageSuggestion suggested={suggested} current={locale} className={className} />;
  }

  return (
    <LanguagePicker
      current={locale}
      label={getDictionary(locale).language.pickerLabel}
      options={ENABLED_LOCALES.map((code) => ({
        code,
        nativeName: LOCALE_INFO[code].nativeName,
      }))}
      className={className}
    />
  );
}
