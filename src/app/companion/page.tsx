import Link from "next/link";
import { BookOpen, Compass, HeartHandshake, Send, Sparkles, Trash2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getCompanionIntent } from "@/lib/companion-intents";
import { getLocale } from "@/lib/i18n/get-locale";
import { wordSpace } from "@/lib/i18n/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { clearConversation, sendMessage } from "./actions";

type MessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function renderMessageContent(content: string, askPdLabel: string) {
  return content
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        // The Companion writes **Ask PD** when it suggests reaching a real
        // person; make that a tappable link rather than just bold text.
        if (inner.trim().toLowerCase() === "ask pd") {
          return (
            <Link
              key={i}
              href="/ask-pd?from=companion"
              className="font-semibold text-primary underline underline-offset-2"
            >
              {askPdLabel}
            </Link>
          );
        }
        return <strong key={i}>{inner}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}

const QUICK_PROMPTS = [
  { icon: BookOpen, key: "scripture" },
  { icon: Compass, key: "nextStep" },
  { icon: HeartHandshake, key: "stuck" },
] as const;

export default async function CompanionPage(
  props: PageProps<"/companion">,
) {
  const searchParams = await props.searchParams;
  const showCrisisBanner = searchParams.crisis === "1";
  const confirmingClear = searchParams.clear === "confirm";
  const intentParam = Array.isArray(searchParams.intent)
    ? searchParams.intent[0]
    : searchParams.intent;
  const intent = getCompanionIntent(intentParam);

  const { supabase, user } = await requireUser();

  const { data: messages, error } = await supabase
    .from("companion_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .returns<MessageRow[]>();

  if (error) {
    console.error("Failed to load companion messages", error);
  }

  const t = getDictionary(await getLocale()).engage.companion;
  const sp = wordSpace(await getLocale());
  const intentMessage = intent ? t.intentMessages[intent.slug] : undefined;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-heading font-semibold">{t.title}</h1>
        <Badge variant="secondary">{t.aiBadge}</Badge>
        <Button
          render={<Link href="/ask-pd?from=companion" />}
          nativeButton={false}
          size="sm"
          variant="outline"
          className="ms-auto rounded-full"
        >
          <UserRound className="size-4" />
          {t.askPd}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t.introBefore}{sp}
        <Link href="/ask-pd?from=companion" className="font-medium text-primary underline">
          {t.askPd}
        </Link>{sp}
        {t.introAfter}
      </p>

      {(messages ?? []).length > 0 &&
        (confirmingClear ? (
          <div className="space-y-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
            <p className="font-medium">{t.clearConfirmTitle}</p>
            <p className="text-xs text-muted-foreground">
              {t.clearConfirmBody}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                render={<Link href="/companion" />}
                nativeButton={false}
                size="sm"
                variant="ghost"
              >
                {t.cancel}
              </Button>
              <form action={clearConversation}>
                <Button type="submit" size="sm" variant="destructive">
                  {t.yesClear}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/companion?clear=confirm"
            className="flex w-fit items-center gap-1 self-end text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
            {t.clearConversation}
          </Link>
        ))}

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          {t.crisisBefore}{sp}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            {t.crisisLink}
          </a>{sp}
          {t.crisisAfter}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {(messages ?? []).length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
            <Sparkles className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t.emptyPrompt}
            </p>
            <div className="w-full space-y-2">
              {QUICK_PROMPTS.map(({ icon: Icon, key }) => {
                const label = t.quickPrompts[key];
                return (
                  <form key={key} action={sendMessage}>
                    <input type="hidden" name="message" value={label} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-start text-sm hover:bg-muted"
                    >
                      <Icon className="size-4 text-primary" />
                      {label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        )}
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ms-auto max-w-[85%] whitespace-pre-wrap rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "me-auto max-w-[85%] whitespace-pre-wrap rounded-xl border bg-card px-3 py-2 text-sm"
            }
          >
            {renderMessageContent(message.content, t.askPd)}
          </div>
        ))}
      </div>

      <form action={sendMessage} className="flex items-end gap-2">
        <Textarea
          name="message"
          placeholder={t.inputPlaceholder}
          defaultValue={intentMessage}
          required
          rows={1}
          className="flex-1 rounded-full"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          aria-label={t.send}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </main>
  );
}
