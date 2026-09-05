"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/supabase/authorize";

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/profile");

  const displayName = String(formData.get("display_name") ?? "").trim() || null;
  const avatarFile = formData.get("avatar");

  const updates: Record<string, unknown> = { display_name: displayName };

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const safeName = avatarFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { contentType: avatarFile.type || undefined });

    if (uploadError) {
      console.error("Failed to upload avatar", uploadError);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      updates.avatar_url = data.publicUrl;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update profile", error);
  }

  revalidatePath("/profile");
  revalidatePath("/");
}
