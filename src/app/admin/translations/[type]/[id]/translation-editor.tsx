"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { draftWithAI, reviewTranslation } from "../../actions";

export type EditorField = {
  name: string;
  label: string;
  english: string | string[] | null;
  multiline: boolean;
  list: boolean;
};

type Labels = {
  draftWithAI: string;
  redraftWithAI: string;
  drafting: string;
  draftFilledForm: string;
  saveDraft: string;
  publish: string;
  publishUpdate: string;
  sendBack: string;
  sendBackNote: string;
  unpublish: string;
  english: string;
  translationIn: string;
  translatorNotes: string;
  onePerLine: string;
  emptyField: string;
};

function toText(value: string | string[] | null | undefined) {
  return Array.isArray(value) ? value.join("\n") : (value ?? "");
}

export function TranslationEditor({
  type,
  id,
  locale,
  fields,
  initial,
  hasRow,
  published,
  labels,
}: {
  type: string;
  id: string;
  locale: string;
  fields: EditorField[];
  initial: Record<string, string | string[] | null>;
  hasRow: boolean;
  published: boolean;
  labels: Labels;
}) {
  const router = useRouter();
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, toText(initial[f.name])])),
  );
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [filledFromAI, setFilledFromAI] = useState(false);
  const [drafting, startDrafting] = useTransition();

  function draft() {
    setAiError(null);
    startDrafting(async () => {
      const result = await draftWithAI(type, id, locale);
      if (!result.ok) {
        setAiError(result.error);
      } else if (result.saved) {
        router.refresh();
      } else {
        setValues(Object.fromEntries(fields.map((f) => [f.name, toText(result.fields[f.name])])));
        setAiNotes(result.notes || null);
        setFilledFromAI(true);
      }
    });
  }

  return (
    <form action={reviewTranslation} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="locale" value={locale} />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={draft} disabled={drafting}>
          <Sparkles className="size-4" />
          {published || hasRow ? labels.redraftWithAI : labels.draftWithAI}
        </Button>
        {drafting && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {labels.drafting}
          </p>
        )}
      </div>
      {aiError && (
        <p role="alert" className="text-sm text-destructive">
          {aiError}
        </p>
      )}
      {filledFromAI && (
        <p className="rounded-lg bg-muted p-3 text-sm" aria-live="polite">
          {labels.draftFilledForm}
        </p>
      )}
      {aiNotes && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="font-medium">{labels.translatorNotes}</p>
          <p className="whitespace-pre-line text-muted-foreground">{aiNotes}</p>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5 rounded-xl border bg-card p-4">
          <Label htmlFor={`tr-${field.name}`} className="text-xs uppercase tracking-wide text-primary">
            {field.label}
          </Label>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground">{labels.english}</p>
            <p lang="en" className="whitespace-pre-line text-sm text-muted-foreground">
              {toText(field.english) || labels.emptyField}
            </p>
          </div>
          <p className="pt-2 text-[11px] font-medium text-muted-foreground">{labels.translationIn}</p>
          {field.multiline || field.list ? (
            <Textarea
              id={`tr-${field.name}`}
              name={field.name}
              lang={locale}
              rows={field.list ? Math.max(3, values[field.name].split("\n").length) : 6}
              value={values[field.name]}
              placeholder={field.list ? labels.onePerLine : undefined}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          ) : (
            <Input
              id={`tr-${field.name}`}
              name={field.name}
              lang={locale}
              value={values[field.name]}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {published ? (
          <>
            <Button type="submit" name="intent" value="publish">
              {labels.publishUpdate}
            </Button>
            <Button type="submit" name="intent" value="unpublish" variant="outline">
              {labels.unpublish}
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" name="intent" value="publish">
              {labels.publish}
            </Button>
            <Button type="submit" name="intent" value="save" variant="outline">
              {labels.saveDraft}
            </Button>
          </>
        )}
      </div>

      {hasRow && !published && (
        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer text-sm font-medium">{labels.sendBack}</summary>
          <div className="mt-3 space-y-2">
            <Label htmlFor="review_note">{labels.sendBackNote}</Label>
            <Textarea id="review_note" name="review_note" rows={3} />
            <Button type="submit" name="intent" value="send_back" variant="outline" size="sm">
              {labels.sendBack}
            </Button>
          </div>
        </details>
      )}
    </form>
  );
}
