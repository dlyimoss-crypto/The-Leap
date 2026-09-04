"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/supabase/authorize";

export async function saveBookmark(reference: string, translation: string) {
  const { supabase, user } = await requireActiveUser("/evolve/scripture");

  const { error } = await supabase.from("scripture_bookmarks").upsert(
    { user_id: user.id, reference, translation },
    { onConflict: "user_id,reference,translation", ignoreDuplicates: true },
  );

  if (error) {
    console.error("Failed to save scripture bookmark", error);
  }

  revalidatePath("/evolve/scripture");
}

export async function removeBookmark(reference: string, translation: string) {
  const { supabase, user } = await requireActiveUser("/evolve/scripture");

  const { error } = await supabase
    .from("scripture_bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("reference", reference)
    .eq("translation", translation);

  if (error) {
    console.error("Failed to remove scripture bookmark", error);
  }

  revalidatePath("/evolve/scripture");
}
