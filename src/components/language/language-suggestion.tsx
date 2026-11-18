import { setLocale } from "@/lib/i18n/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * One-time offer to switch to the device's language, written in that
 * language so the person can read it. Either answer is remembered on this
 * device, so it isn't asked again.
 */
export function LanguageSuggestion({
  suggested,
  current,
  className,
}: {
  suggested: Locale;
  current: Locale;
  className?: string;
}) {
  const dict = getDictionary(suggested).language;

  return (
    <div
      lang={suggested}
      role="region"
      aria-label={dict.pickerLabel}
      className={cn(
        "flex w-full max-w-xs flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border px-3 py-2 text-sm",
        className,
      )}
    >
      <span>{dict.suggest}</span>
      <span className="flex gap-1">
        <form action={setLocale}>
          <input type="hidden" name="locale" value={suggested} />
          <button type="submit" className="rounded-md px-2 py-0.5 font-semibold underline-offset-4 hover:underline">
            {dict.accept}
          </button>
        </form>
        <form action={setLocale}>
          <input type="hidden" name="locale" value={current} />
          <button type="submit" className="rounded-md px-2 py-0.5 opacity-70 underline-offset-4 hover:underline">
            {dict.decline}
          </button>
        </form>
      </span>
    </div>
  );
}
