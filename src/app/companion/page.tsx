import { redirect } from "next/navigation";
import { BookOpen, Compass, HeartHandshake, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { sendMessage } from "./actions";

type MessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    label: "Help me understand today's Scripture",
  },
  {
    icon: Compass,
    label: "What's my next step?",
  },
  {
    icon: HeartHandshake,
    label: "I'm feeling stuck",
  },
] as const;

export default async function CompanionPage(
  props: PageProps<"/companion">,
) {
  const searchParams = await props.searchParams;
  const showCrisisBanner = searchParams.crisis === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: messages, error } = await supabase
    .from("companion_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .returns<MessageRow[]>();

  if (error) {
    console.error("Failed to load companion messages", error);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-heading font-semibold">Leap Companion</h1>
        <Badge variant="secondary">AI</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        I&apos;m an AI guide, not a pastor or mentor — here to help with
        Scripture questions, working through today&apos;s session, or when
        you&apos;re feeling stuck.
      </p>

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          You don&apos;t have to go through this alone. If you&apos;re in
          immediate danger or thinking about harming yourself, please seek
          immediate help.{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            Find crisis support in your country →
          </a>{" "}
          You can also contact a trusted person, local church, professional
          counselor, or emergency service.
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {(messages ?? []).length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
            <Sparkles className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              What would you like help with?
            </p>
            <div className="w-full space-y-2">
              {QUICK_PROMPTS.map(({ icon: Icon, label }) => (
                <form key={label} action={sendMessage}>
                  <input type="hidden" name="message" value={label} />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    <Icon className="size-4 text-primary" />
                    {label}
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "mr-auto max-w-[85%] rounded-xl border bg-card px-3 py-2 text-sm"
            }
          >
            {message.content}
          </div>
        ))}
      </div>

      <form action={sendMessage} className="flex items-end gap-2">
        <Textarea
          name="message"
          placeholder="Ask the Companion…"
          required
          rows={1}
          className="flex-1 rounded-full"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </main>
  );
}
