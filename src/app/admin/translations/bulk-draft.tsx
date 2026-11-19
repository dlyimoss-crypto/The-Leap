"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interpolate } from "@/lib/i18n/format";
import { draftWithAI } from "./actions";

/**
 * Translates and publishes everything missing or out of date in one
 * language, one AI call at a time (each call is its own short server
 * request, so none runs into a time limit).
 */
export function BulkDraft({
  locale,
  items,
  labels,
}: {
  locale: string;
  items: { type: string; id: string }[];
  labels: { start: string; progress: string; stop: string; done: string };
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [result, setResult] = useState<{ ok: number; failed: string[] } | null>(null);
  const stopRequested = useRef(false);
  const [, startTransition] = useTransition();

  async function run() {
    stopRequested.current = false;
    setRunning(true);
    setResult(null);
    setDone(0);
    let ok = 0;
    const failed: string[] = [];
    for (const item of items) {
      if (stopRequested.current) break;
      const res = await draftWithAI(item.type, item.id, locale, { force: false });
      if (res.ok) ok++;
      else failed.push(res.error);
      setDone((d) => d + 1);
    }
    setRunning(false);
    setResult({ ok, failed });
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-3">
      {running ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm" aria-live="polite">
            {interpolate(labels.progress, { done: done + 1, total: items.length })}
          </p>
          <Button size="sm" variant="outline" onClick={() => (stopRequested.current = true)}>
            {labels.stop}
          </Button>
        </div>
      ) : (
        // Long in some languages (French, Swahili): let it wrap on small screens.
        <Button size="sm" onClick={run} className="h-auto max-w-full shrink whitespace-normal py-1.5 text-start">
          <Sparkles className="size-4" />
          {interpolate(labels.start, { count: items.length })}
        </Button>
      )}
      {result && (
        <div className="text-sm" aria-live="polite">
          <p>{interpolate(labels.done, { ok: result.ok, failed: result.failed.length })}</p>
          {[...new Set(result.failed)].map((message) => (
            <p key={message} className="text-destructive">
              {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
