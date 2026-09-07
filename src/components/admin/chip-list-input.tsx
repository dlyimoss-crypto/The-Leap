"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A "type one, press Enter" list builder that still submits as a plain
// newline-joined string via a hidden input — so the server action reading
// `formData.get(name)` and splitting on "\n" doesn't need to change.
export function ChipListInput({
  name,
  defaultValue = [],
  suggestions = [],
  placeholder,
}: {
  name: string;
  defaultValue?: string[];
  suggestions?: readonly string[];
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function addItem(value: string) {
    const trimmed = value.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems((prev) => [...prev, trimmed]);
  }

  function handleAddDraft() {
    addItem(draft);
    setDraft("");
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const availableSuggestions = suggestions.filter((s) => !items.includes(s));

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={items.join("\n")} />

      {items.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-xs"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label={`Remove ${item}`}
                className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddDraft();
            }
          }}
          placeholder={placeholder ?? "Type a point, then press Enter"}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddDraft}
        >
          Add
        </Button>
      </div>

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addItem(s)}
              className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
