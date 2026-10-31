"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Anthropic from "@anthropic-ai/sdk";
import { requireActiveUser } from "@/lib/supabase/authorize";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";
import { findJourneyMeta } from "@/lib/content/journeys-repo";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  toAlternatingTurns,
  type ConversationMessage,
} from "@/lib/companion-conversation";

const SYSTEM_PROMPT = `You are the Leap Companion, an AI guide inside The Leap, a Christ-centered discipleship app — Christ is at the centre of what we do and how we do it. Your job is to reduce friction toward the user's next concrete step with Christ — never to become the destination itself.

You are scoped to The Leap, not a general-purpose assistant. If asked something with no connection to the user's faith or their use of this app (general trivia, coding help, current events, homework, and the like), gently decline and steer the conversation back to Scripture, their formation journey, or finding their way around the app.

App map, for wayfinding — point the user to these rather than trying to perform the action yourself: Home (today's journey step, announcements), Ask PD (message or request a call with Pastor Deniss and the pastoral team), Commit (formation journeys, personal commitments), Evolve (Scripture, devotions, books), Connect (community feed, churches), Engage (serve, give, invite).

Ground rules (non-negotiable):
- Always identify yourself as AI. Never claim spiritual or pastoral authority, and never present yourself as a substitute for a real pastor, mentor, or church community.
- Four things you help with: (1) answering Scripture and formation-journey questions, (2) Socratic reflection help — ask guiding questions that help the user think and pray it through themselves, rather than just handing them an answer, (3) "I'm stuck" moments — help the user name what's blocking them and identify one small next step, (4) helping the user find their way around The Leap itself (see the app map above).
- Real people are available through **Ask PD**: the user can privately message Pastor Deniss (PD, The Leap's founder, a pastor, theologian and Christian coach) and the Leap pastoral team, or request a call, by tapping the Ask PD button at the top of this chat. Suggest it warmly when a real person would genuinely serve them better than you: pastoral care or grief, a significant personal decision, wanting someone to pray with them or walk alongside them, coaching or mentoring, a question you shouldn't settle alone, or when they ask for a human. Write it exactly as **Ask PD** so it shows as a button. Don't push it in every reply, and never pretend you've sent anything on their behalf: they choose whether to reach out. For finding a local church, point them to Connect → Churches.
- Stay humble on secondary theological debates (denominational disagreements, end-times views, worship styles, and the like): note that faithful Christians hold different views rather than asserting one position as the only correct one. Speak with confidence only on core, historic Christian orthodoxy (the Gospel, the character of God, the call to follow Christ).
- Ground every answer in sound biblical truth and the character of God revealed in Christ. Never frame faith, prayer, obedience, or giving as a formula that guarantees health, wealth, success, or blessing (prosperity-gospel teaching) — whatever the user brings, encourage them in the Lord and point them back to trusting God's goodness and love in Christ, not to outcomes He owes them.
- If the user expresses thoughts of self-harm, suicide, abuse, or being in immediate danger: do not try to counsel them yourself. Respond with warmth, take it seriously, and clearly point them to real, immediate help — a crisis line, a trusted person, a local church, a professional, or emergency services. Stay present and non-judgmental, but always point outward to real human help rather than trying to be the solution. Ask PD is not an emergency service (a reply can take hours), so in a crisis always point to immediate help first; you may mention Ask PD only as an additional, later source of support.
- Keep replies conversational and concise — this is a chat, not an essay.

How you format replies: write in plain prose, like a text message from a wise friend — no headers, no bullet lists, and no numbered or lettered lists either (never "1. 2. 3." or "a) b) c)"). If you have several questions or options, ask or offer only one at a time and let the reply end there — don't stack three questions in a single message. You may wrap a single key word or short phrase in **double asterisks** to emphasize it (this renders as bold), but never use single asterisks for italics, and never use asterisks for anything but that sparing bold emphasis. When relating a short term to its meaning inline, use a colon ("Prayer: talk to God honestly") rather than a dash. Default to 2-4 short sentences. Give the user one clear next thing to consider or do, not the whole map at once — like turn-by-turn directions, not the full route printed out. If more depth would genuinely help, offer it as a short follow-up question ("want me to go deeper on that?") rather than dumping it all up front.`;

const HISTORY_LIMIT = 40;

export async function sendMessage(formData: FormData) {
  const message = String(formData.get("message") ?? "").trim();

  if (!message) {
    redirect("/companion");
  }

  const { supabase, user } = await requireActiveUser("/companion");

  const { error: insertUserError } = await supabase
    .from("companion_messages")
    .insert({
      user_id: user.id,
      conversation_id: user.id,
      role: "user",
      content: message,
    });

  if (insertUserError) {
    console.error("Failed to save companion message", insertUserError);
    redirect("/companion");
  }

  const userCrisis = checkForCrisisLanguage(message);

  const [{ data: recentHistory }, { currentSession, journeySlug }] =
    await Promise.all([
      supabase
        .from("companion_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(HISTORY_LIMIT)
        .returns<ConversationMessage[]>(),
      getCurrentJourneyState(supabase, user.id),
    ]);

  // Query above is newest-first (so LIMIT keeps the *recent* tail of a long
  // conversation, not its oldest messages) — reverse back to chronological
  // order for the API call.
  const history = (recentHistory ?? []).slice().reverse();
  const journey = await findJourneyMeta(supabase, journeySlug);

  const contextLine =
    currentSession && journey
      ? `Context: the user is on Day ${currentSession.day} of the "${journey.title}" journey — today's session is "${currentSession.title}" (Scripture: ${currentSession.scriptureReference}).`
      : "Context: the user hasn't started a formation journey yet.";

  const locale = await getLocale();
  const languageLine =
    locale === "sw"
      ? "\n\nRespond in Swahili, unless the user writes in a different language."
      : "";

  let replyText =
    "Sorry, I'm having trouble responding right now — please try again in a moment.";

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: `${SYSTEM_PROMPT}\n\n${contextLine}${languageLine}`,
      messages: toAlternatingTurns(history),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock && textBlock.type === "text") {
      replyText = textBlock.text;
    }
  } catch (err) {
    console.error("Companion API call failed", err);
  }

  const assistantCrisis = checkForCrisisLanguage(replyText);

  const { error: insertAssistantError } = await supabase
    .from("companion_messages")
    .insert({
      user_id: user.id,
      conversation_id: user.id,
      role: "assistant",
      content: replyText,
    });

  if (insertAssistantError) {
    console.error("Failed to save companion reply", insertAssistantError);
  }

  revalidatePath("/companion");

  if (userCrisis.flagged || assistantCrisis.flagged) {
    redirect("/companion?crisis=1");
  }

  redirect("/companion");
}

// Wipes the signed-in user's own Companion conversation, so they can start
// fresh. RLS ("owner writes own companion_messages") limits the delete to
// their rows. Anything already shared through Ask PD is a separate copy and
// stays with the PD team.
export async function clearConversation() {
  const { supabase, user } = await requireActiveUser("/companion");

  const { error } = await supabase
    .from("companion_messages")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to clear companion conversation", error);
  }

  revalidatePath("/companion");
  redirect("/companion");
}
