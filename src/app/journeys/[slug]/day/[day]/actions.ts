"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeSession(
  journeySlug: string,
  dayNumber: number,
  durationDays: number,
) {
  const isLastDay = dayNumber >= durationDays;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.rpc("record_session_completion", {
      p_journey_slug: journeySlug,
      p_session_number: dayNumber,
      p_is_last_day: isLastDay,
    });

    if (error) {
      // Never block the discipleship flow on a backend hiccup — but log it
      // so a silently-lost completion is at least visible server-side.
      console.error("Failed to record session completion", error);
    }
  }

  redirect(isLastDay ? "/" : `/journeys/${journeySlug}/day/${dayNumber + 1}`);
}
