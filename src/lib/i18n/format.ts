// Locale-aware formatting that works in server *and* client components
// (plain functions of a locale string — no server-only imports).
//
// Message conventions:
// - Values in a message: "{count} days left" + interpolate(msg, { count }).
// - Plurals: a forms object { one: "{count} day left", other: "{count} days left" }
//   + plural(locale, count, forms). Languages pick forms by Intl.PluralRules
//   (e.g. zh only uses `other`; supply `other` always).
// - Dates/times/numbers: formatDate / formatTime / formatNumber, never a
//   hardcoded "en-US".

import type { Locale } from "./locales";

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

/** Replaces {name} placeholders with values; unknown names are left as-is. */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

/** Picks the plural form for `count` in `locale`, then fills {count}. */
export function plural(
  locale: Locale | string,
  count: number,
  forms: PluralForms,
  values: Record<string, string | number> = {},
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  const template = forms[rule] ?? forms.other;
  return interpolate(template, { count: formatNumber(locale, count), ...values });
}

export function formatNumber(
  locale: Locale | string,
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  locale: Locale | string,
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return new Intl.DateTimeFormat(locale, options).format(toDate(date));
}

export function formatTime(
  locale: Locale | string,
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" },
): string {
  return new Intl.DateTimeFormat(locale, options).format(toDate(date));
}

/** A plain "YYYY-MM-DD" is a calendar date, not UTC midnight. */
function toDate(date: Date | string | number): Date {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(`${date}T00:00:00`);
  }
  return new Date(date);
}

/**
 * The space between a sentence and a link inside it. Chinese runs words
 * together, so stitching "intro" + link + "outro" with a hard-coded " "
 * would leave stray gaps there.
 */
export function wordSpace(locale: Locale | string): string {
  return locale.startsWith("zh") ? "" : " ";
}
