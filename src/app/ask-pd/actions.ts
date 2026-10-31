"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";
import { getPdTeamUserIds, sendPushToUsers } from "@/lib/push";
import { requireActiveUser, requirePdTeam } from "@/lib/supabase/authorize";
import {
  COMPANION_SNAPSHOT_LIMIT,
  isContactMethod,
  type CompanionSnapshotMessage,
} from "@/lib/supabase/ask-pd";

function text(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, max);
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

  const firstMessage =
    body || "I'd like to talk with Pastor Deniss or the PD team.";
  const { error: messageError } = await supabase.from("ask_pd_messages").insert({
    request_id: request.id,
    author_id: user.id,
    from_team: false,
    body: firstMessage,
  });
  if (messageError) {
    console.error("Failed to save Ask PD message", messageError);
  }

  await sendPushToUsers(await getPdTeamUserIds(), {
    title: kind === "call" ? "New call request" : "New Ask PD message",
    body: "Someone has reached out through Ask PD.",
    url: `/ask-pd/inbox/${request.id}`,
  });

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
    await sendPushToUsers(await getPdTeamUserIds(), {
      title: "New Ask PD follow-up",
      body: "Someone replied in an Ask PD conversation.",
      url: `/ask-pd/inbox/${requestId}`,
    });
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
      await sendPushToUsers([request.user_id], {
        title: "Pastor Deniss replied",
        body: "You have a new reply in Ask PD.",
        url: `/ask-pd/${requestId}`,
      });
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
