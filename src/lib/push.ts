import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export type PushMessage = { title: string; body: string; url: string };

/**
 * Sends a push notification to every device the given users have opted in
 * on (the same subscriptions the daily devotion reminder uses). Best
 * effort: a failure is logged, never thrown, so it can't break the action
 * that triggered it. Keep message bodies free of private content: they show
 * on lock screens.
 */
export async function sendPushToUsers(
  userIds: string[],
  message: PushMessage,
): Promise<void> {
  if (
    userIds.length === 0 ||
    !process.env.VAPID_PRIVATE_KEY ||
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_SUBJECT
  ) {
    return;
  }

  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );

    const supabase = createAdminClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .in("user_id", userIds)
      .returns<{ id: string; endpoint: string; p256dh: string; auth: string }[]>();

    const payload = JSON.stringify(message);
    const expired: string[] = [];

    await Promise.all(
      (subs ?? []).map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          );
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) {
            expired.push(sub.id);
          } else {
            console.error("Failed to send push", status, err);
          }
        }
      }),
    );

    if (expired.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }
  } catch (err) {
    console.error("Push delivery failed", err);
  }
}

/** User ids of Pastor Deniss and the PD team, for Ask PD alerts. */
export async function getPdTeamUserIds(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["pastor", "admin"]);
  return (data ?? []).map((p) => p.id as string);
}
