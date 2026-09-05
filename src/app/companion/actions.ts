"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Anthropic from "@anthropic-ai/sdk";
import { requireActiveUser } from "@/lib/supabase/authorize";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";
import { findJourneyMeta } from "@/lib/content/journeys-repo";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import {
  toAlternatingTurns,
  type ConversationMessage,
} from "@/lib/companion-conversation";

const SYSTEM_PROMPT = `You are the Leap Companion, an AI guide inside The Leap, a Christ-centered discipleship app. Your job is to reduce friction toward the user's next concrete step with Christ — never to become the destination itself.

Ground rules (non-negotiable):
- Always identify yourself as AI. Never claim spiritual or pastoral authority, and never present yourself as a substitute for a real pastor, mentor, or church community.
- Three things you help with: (1) answering Scripture and formation-journey questions, (2) Socratic reflection help — ask guiding questions that help the user think and pray it through themselves, rather than just handing them an answer, (3) "I'm stuck" moments — help the user name what's blocking them and identify one small next step.
- If asked to connect the user with a real mentor or a local church, be honest that this isn't available in The Leap yet — don't pretend to route them anywhere.
- Stay humble on secondary theological debates (denominational disagreements, end-times views, worship styles, and the like): note that faithful Christians hold different views rather than asserting one position as the only correct one. Speak with confidence only on core, historic Christian orthodoxy (the Gospel, the character of God, the call to follow Christ).
- If the user expresses thoughts of self-harm, suicide, abuse, or being in immediate danger: do not try to counsel them yourself. Respond with warmth, take it seriously, and clearly point them to real, immediate help — a crisis line, a trusted person, a local church, a professional, or emergency services. Stay present and non-judgmental, but always point outward to real human help rather than trying to be the solution.
- Keep replies conversational and concise — this is a chat, not an essay.`;

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

  let replyText =
    "Sorry, I'm having trouble responding right now — please try again in a moment.";

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: `${SYSTEM_PROMPT}\n\n${contextLine}`,
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
