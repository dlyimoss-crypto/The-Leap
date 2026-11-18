"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";
import {
  getPdTeamUserIds,
  sendPushToUsers,
  type PushMessage,
} from "@/lib/push";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveUser, requirePdTeam } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  getDictionary,
  isEnabledLocale,
  type Dictionary,
} from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import {
  COMPANION_SNAPSHOT_LIMIT,
  isContactMethod,
  type CompanionSnapshotMessage,
} from "@/lib/supabase/ask-pd";

function text(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

type PushMessages = Dictionary["engage"]["askPd"]["push"];

// Push copy goes out in each recipient's own language (their profile's
// preferred_language), not the sender's: users are grouped by language
// and each group gets its own message.
async function sendAskPdPush(
  userIds: string[],
  build: (messages: PushMessages) => Omit<PushMessage, "url">,
  url: string,
) {
  if (userIds.length === 0) return;

  // Best effort, like the push itself: a failed lookup falls back to English.
  let stored = new Map<string, string | null>();
  try {
    const { data } = await createAdminClient()
      .from("profiles")
      .select("id, preferred_language")
      .in("id", userIds)
      .returns<{ id: string; preferred_language: string | null }[]>();
    stored = new Map((data ?? []).map((p) => [p.id, p.preferred_language]));
  } catch (err) {
    console.error("Failed to load push recipients' languages", err);
  }

  const byLocale = new Map<Locale, string[]>();
  for (const id of userIds) {
    const value = stored.get(id);
    const locale =
      isLocale(value) && isEnabledLocale(value) ? value : DEFAULT_LOCALE;
    byLocale.set(locale, [...(byLocale.get(locale) ?? []), id]);
  }

  await Promise.all(
    [...byLocale].map(([locale, ids]) =>
      sendPushToUsers(ids, {
        ...build(getDictionary(locale).engage.askPd.push),
        url,
      }),
    ),
  );
}

// A new Ask PD request: a private message, or a call request whose note
// becomes the first message of the thread.
export async function createAskPdRequest(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/ask-pd");

  const kind = formData.get("kind") === "call" ? "call" : "message";
  const body = text(formData, "body", 5000);
  const contactMethodRaw = formData.get("contact_method");
  const contactDetail = text(formData, "contact_detail", 200);
  const preferredTime = text(formData, "preferred_time", 200);

  if (kind === "message" && !body) {
    redirect("/ask-pd?error=empty");
  }
  if (kind === "call" && (!isContactMethod(contactMethodRaw) || !contactDetail)) {
    redirect("/ask-pd?tab=call&error=contact");
  }

  let companionSnapshot: CompanionSnapshotMessage[] | null = null;
  if (formData.get("share_companion") === "on") {
    const { data } = await supabase
      .from("companion_messages")
      .select("role, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(COMPANION_SNAPSHOT_LIMIT)
      .returns<CompanionSnapshotMessage[]>();
    companionSnapshot = data && data.length > 0 ? [...data].reverse() : null;
  }

  const { data: request, error } = await supabase
    .from("ask_pd_requests")
    .insert({
      user_id: user.id,
      kind,
      contact_method: kind === "call" ? contactMethodRaw : null,
      contact_detail: kind === "call" ? contactDetail : null,
      preferred_time: kind === "call" ? preferredTime || null : null,
      companion_snapshot: companionSnapshot,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !request) {
    console.error("Failed to create Ask PD request", error);
    redirect("/ask-pd?error=failed");
  }

  // Written on the sender's behalf, so in the sender's language.
  const firstMessage =
    body || getDictionary(await getLocale()).engage.askPd.defaultCallMessage;
  const { error: messageError } = await supabase.from("ask_pd_messages").insert({
    request_id: request.id,
    author_id: user.id,
    from_team: false,
    body: firstMessage,
  });
  if (messageError) {
    console.error("Failed to save Ask PD message", messageError);
  }

  await sendAskPdPush(
    await getPdTeamUserIds(),
    (m) => ({
      title: kind === "call" ? m.newCallRequestTitle : m.newMessageTitle,
      body: m.newRequestBody,
    }),
    `/ask-pd/inbox/${request.id}`,
  );

  revalidatePath("/ask-pd");
  revalidatePath("/", "layout");

  const crisis = checkForCrisisLanguage(firstMessage).flagged;
  redirect(`/ask-pd/${request.id}?sent=1${crisis ? "&crisis=1" : ""}`);
}

export async function replyAsUser(requestId: string, formData: FormData) {
  const { supabase, user } = await requireActiveUser(`/ask-pd/${requestId}`);
  const body = text(formData, "body", 5000);
  if (!body) {
    redirect(`/ask-pd/${requestId}`);
  }

  const { error } = await supabase.from("ask_pd_messages").insert({
    request_id: requestId,
    author_id: user.id,
    from_team: false,
    body,
  });
  if (error) {
    console.error("Failed to send Ask PD follow-up", error);
  } else {
    await sendAskPdPush(
      await getPdTeamUserIds(),
      (m) => ({ title: m.followUpTitle, body: m.followUpBody }),
      `/ask-pd/inbox/${requestId}`,
    );
  }

  revalidatePath(`/ask-pd/${requestId}`);
  revalidatePath("/", "layout");
  const crisis = checkForCrisisLanguage(body).flagged;
  redirect(`/ask-pd/${requestId}${crisis ? "?crisis=1" : ""}`);
}

export async function replyAsTeam(requestId: string, formData: FormData) {
  const { supabase, user } = await requirePdTeam();
  const body = text(formData, "body", 5000);
  if (!body) {
    redirect(`/ask-pd/inbox/${requestId}`);
  }

  const { error } = await supabase.from("ask_pd_messages").insert({
    request_id: requestId,
    author_id: user.id,
    from_team: true,
    body,
  });

  if (error) {
    console.error("Failed to send Ask PD reply", error);
  } else {
    const { data: request } = await supabase
      .from("ask_pd_requests")
      .select("user_id")
      .eq("id", requestId)
      .maybeSingle<{ user_id: string }>();
    if (request) {
      await sendAskPdPush(
        [request.user_id],
        (m) => ({ title: m.repliedTitle, body: m.repliedBody }),
        `/ask-pd/${requestId}`,
      );
    }
  }

  revalidatePath(`/ask-pd/inbox/${requestId}`);
  revalidatePath("/ask-pd/inbox");
  revalidatePath("/", "layout");
  redirect(`/ask-pd/inbox/${requestId}`);
}

// Closing marks a request handled (e.g. after the call took place);
// reopening puts it back in the team's queue.
export async function setAskPdStatus(
  requestId: string,
  status: "closed" | "open",
) {
  const { supabase } = await requirePdTeam();

  const { error } = await supabase
    .from("ask_pd_requests")
    .update({
      status,
      team_unread: status === "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("Failed to update Ask PD request", error);
  }

  revalidatePath(`/ask-pd/inbox/${requestId}`);
  revalidatePath("/ask-pd/inbox");
  revalidatePath("/", "layout");
}

// Marking the inbox item as seen without replying (e.g. a call request
// handled by phone) — clears the badge but keeps it open.
export async function markAskPdSeenByTeam(requestId: string) {
  const { supabase } = await requirePdTeam();
  await supabase
    .from("ask_pd_requests")
    .update({ team_unread: false })
    .eq("id", requestId);
  revalidatePath("/ask-pd/inbox");
  revalidatePath("/", "layout");
}
