"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/supabase/authorize";

export async function updateDisplayName(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/profile");

  const displayName = String(formData.get("display_name") ?? "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update display name", error);
  }

  revalidatePath("/profile");
  revalidatePath("/");
}

export async function updateAvatar(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/profile");

  const avatarFile = formData.get("avatar");

  if (!(avatarFile instanceof File) || avatarFile.size === 0) {
    return;
  }

  const path = `${user.id}/${Date.now()}-avatar.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, avatarFile, { contentType: avatarFile.type || "image/jpeg" });

  if (uploadError) {
    console.error("Failed to upload avatar", uploadError);
    return;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to save avatar url", error);
  }

  revalidatePath("/profile");
  revalidatePath("/");
}
