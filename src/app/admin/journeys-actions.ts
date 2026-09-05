"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/authorize";

function journeyFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    purpose: String(formData.get("purpose") ?? "").trim(),
    duration_days: Number.parseInt(
      String(formData.get("duration_days") ?? "0"),
      10,
    ),
    completion_title: String(formData.get("completion_title") ?? "").trim(),
  };
}

export async function createJourney(formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("journeys").insert(journeyFields(formData));

  if (error) {
    console.error("Failed to create journey", error);
  }

  revalidatePath("/admin");
}

export async function updateJourney(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("journeys")
    .update(journeyFields(formData))
    .eq("id", id);

  if (error) {
    console.error("Failed to update journey", error);
  }

  revalidatePath("/admin");
}

// A journey with any day missing its content 404s the moment a user reaches
// that day (the day page has nothing to render), so publishing is blocked
// until every day 1..duration_days has been written.
export async function publishJourney(id: string) {
  const { supabase } = await requireAdmin();

  const { data: journey } = await supabase
    .from("journeys")
    .select("duration_days")
    .eq("id", id)
    .single<{ duration_days: number }>();

  const { data: days } = await supabase
    .from("journey_days")
    .select("day_number")
    .eq("journey_id", id)
    .returns<{ day_number: number }[]>();

  const writtenDays = new Set((days ?? []).map((d) => d.day_number));
  const missingDays = journey
    ? Array.from({ length: journey.duration_days }, (_, i) => i + 1).filter(
        (n) => !writtenDays.has(n),
      )
    : [];

  if (missingDays.length > 0) {
    redirect(
      `/admin?tab=journeys&journey=${id}&publish_error=missing_days`,
    );
  }

  const { error } = await supabase
    .from("journeys")
    .update({ status: "published" })
    .eq("id", id);

  if (error) {
    console.error("Failed to publish journey", error);
  }

  revalidatePath("/admin");
}

export async function unpublishJourney(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("journeys")
    .update({ status: "draft" })
    .eq("id", id);

  if (error) {
    console.error("Failed to unpublish journey", error);
  }

  revalidatePath("/admin");
}

export async function deleteJourney(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("journeys").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete journey", error);
  }

  revalidatePath("/admin");
}

function journeyDayFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    scripture_reference: String(formData.get("scripture_reference") ?? "").trim(),
    explore: String(formData.get("explore") ?? "").trim(),
    reflect: String(formData.get("reflect") ?? "").trim(),
    pray: String(formData.get("pray") ?? "").trim() || null,
    practice: String(formData.get("practice") ?? "").trim(),
    connect: String(formData.get("connect") ?? "").trim(),
    next_topic: String(formData.get("next_topic") ?? "").trim() || null,
  };
}

export async function saveJourneyDay(
  journeyId: string,
  dayNumber: number,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("journey_days")
    .upsert(
      {
        journey_id: journeyId,
        day_number: dayNumber,
        ...journeyDayFields(formData),
      },
      { onConflict: "journey_id,day_number" },
    );

  if (error) {
    console.error("Failed to save journey day", error);
  }

  revalidatePath("/admin");
}
