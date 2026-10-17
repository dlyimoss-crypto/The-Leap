import webpush from "web-push";
import { reminderDueOn } from "@/lib/devotion-reminders";
import { createAdminClient } from "@/lib/supabase/admin";

type SubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  remind_hour: number;
  time_zone: string;
  last_sent_on: string | null;
};

/**
 * Sends the daily devotion reminder. Called hourly by a Supabase pg_cron
 * job (set up by scripts/setup-devotion-reminders.sh) with `Authorization: Bearer
 * $CRON_SECRET`. Each device is reminded once per local day at its chosen
 * hour, and skipped if its owner has already read today's devotion.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  const supabase = createAdminClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Same rule as the devotion page: the newest devotion published by today.
  const { data: devotion } = await supabase
    .from("devotions")
    .select("id, title")
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; title: string }>();

  if (!devotion) {
    return Response.json({ sent: 0, reason: "no devotion" });
  }

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select(
      "id, user_id, endpoint, p256dh, auth, remind_hour, time_zone, last_sent_on",
    )
    .returns<SubscriptionRow[]>();

  if (error) {
    console.error("Failed to load push subscriptions", error);
    return new Response("Failed to load subscriptions", { status: 500 });
  }

  const due = (subscriptions ?? []).flatMap((sub) => {
    const dueOn = reminderDueOn(sub, now);
    return dueOn ? [{ sub, dueOn }] : [];
  });

  if (due.length === 0) {
    return Response.json({ sent: 0 });
  }

  const { data: reads } = await supabase
    .from("devotion_reads")
    .select("user_id")
    .eq("devotion_id", devotion.id)
    .in("user_id", [...new Set(due.map(({ sub }) => sub.user_id))]);
  const alreadyRead = new Set((reads ?? []).map((r) => r.user_id));

  const payload = JSON.stringify({
    title: "Today's devotion is ready",
    body: devotion.title,
    url: "/evolve/devotion",
  });

  let sent = 0;
  let skipped = 0;
  const expired: string[] = [];

  await Promise.all(
    due.map(async ({ sub, dueOn }) => {
      if (alreadyRead.has(sub.user_id)) {
        skipped++;
      } else {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          );
          sent++;
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          // 404/410: the browser dropped this subscription for good.
          if (status === 404 || status === 410) {
            expired.push(sub.id);
            return;
          }
          console.error("Failed to send devotion reminder", status, err);
          return;
        }
      }
      // Mark the day done either way so a reader isn't re-checked hourly.
      await supabase
        .from("push_subscriptions")
        .update({ last_sent_on: dueOn })
        .eq("id", sub.id);
    }),
  );

  if (expired.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", expired);
  }

  return Response.json({ sent, skipped, expired: expired.length });
}
