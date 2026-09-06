"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCommitment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return;
  }

  const { error } = await supabase
    .from("commitments")
    .insert({ user_id: user.id, body });

  if (error) {
    console.error("Failed to create commitment", error);
  }

  revalidatePath("/commit");
  revalidatePath("/");
}

export async function completeCommitment(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { error } = await supabase
    .from("commitments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to complete commitment", error);
  }

  revalidatePath("/commit");
  revalidatePath("/");
}
