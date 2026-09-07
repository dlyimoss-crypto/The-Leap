"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

// A plain textarea with a row of clickable starter phrases above it — a
// shortcut for the blank-page problem on long-form fields, not an attempt
// to write the content itself. Clicking a suggestion inserts it as a new
// line at the end and focuses the field so typing continues naturally.
export function SuggestibleTextarea({
  id,
  name,
  rows,
  required,
  defaultValue,
  placeholder,
  suggestions,
}: {
  id: string;
  name: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  suggestions: readonly string[];
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insert(text: string) {
    const el = ref.current;
    if (!el) return;
    el.value = el.value && !el.value.endsWith("\n") ? `${el.value}\n${text}` : `${el.value}${text}`;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => insert(s)}
            className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
          >
            + {s}
          </button>
        ))}
      </div>
      <Textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
