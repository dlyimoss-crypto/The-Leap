"use server";

import { requireUser } from "@/lib/supabase/authorize";

export type ReminderSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function clampHour(hour: number): number {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 7;
}

export async function saveDevotionReminder(
  subscription: ReminderSubscription,
  remindHour: number,
  timeZone: string,
): Promise<{ ok: boolean }> {
  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("save_push_subscription", {
    p_endpoint: subscription.endpoint,
    p_p256dh: subscription.keys.p256dh,
    p_auth: subscription.keys.auth,
    p_remind_hour: clampHour(remindHour),
    p_time_zone: timeZone || "UTC",
  });

  if (error) {
    console.error("Failed to save devotion reminder", error);
    return { ok: false };
  }
  return { ok: true };
}

export async function removeDevotionReminder(endpoint: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to remove devotion reminder", error);
  }
}

export async function getDevotionReminderHour(
  endpoint: string,
): Promise<number | null> {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("push_subscriptions")
    .select("remind_hour")
    .eq("endpoint", endpoint)
    .eq("user_id", user.id)
    .maybeSingle<{ remind_hour: number }>();

  return data?.remind_hour ?? null;
}
