"use client";

import { Globe } from "lucide-react";
import { setLocale } from "@/lib/i18n/actions";
import { cn } from "@/lib/utils";

type Option = { code: string; nativeName: string };

/**
 * Compact language dropdown for the screens a visitor sees before signing
 * in. Choosing a language submits straight away. Signed-in users change
 * language from Profile instead.
 */
export function LanguagePicker({
  current,
  options,
  label,
  className,
}: {
  current: string;
  options: Option[];
  label: string;
  className?: string;
}) {
  if (options.length < 2) return null;

  return (
    <form action={setLocale} className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Globe aria-hidden className="size-4 shrink-0" />
      <select
        name="locale"
        aria-label={label}
        defaultValue={current}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="cursor-pointer rounded-md bg-transparent py-1 pe-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&>option]:text-foreground"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code} lang={option.code}>
            {option.nativeName}
          </option>
        ))}
      </select>
    </form>
  );
}
