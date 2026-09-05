"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/supabase/authorize";
import { createClient } from "@/lib/supabase/server";

function parseCategories(raw: string): string[] {
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

function parsePriceCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const value = Number.parseFloat(trimmed);
  if (Number.isNaN(value) || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}

function storagePath(userId: string, file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${userId}/${Date.now()}-${safeName}`;
}

async function uploadIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  userId: string,
  entry: FormDataEntryValue | null,
): Promise<string | null> {
  if (!(entry instanceof File) || entry.size === 0) {
    return null;
  }
  const path = storagePath(userId, entry);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, entry, { contentType: entry.type || undefined });

  if (error) {
    console.error(`Failed to upload to ${bucket}`, error);
    return null;
  }
  return path;
}

export async function applyToBeAuthor(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/evolve/books");

  const bio = String(formData.get("bio") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim() || null;

  const { data: existing } = await supabase
    .from("author_applications")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("author_applications")
        .update({ bio, reason, website, status: "pending", review_notes: null })
        .eq("id", existing.id)
    : await supabase
        .from("author_applications")
        .insert({ user_id: user.id, bio, reason, website });

  if (error) {
    console.error("Failed to submit author application", error);
  }

  revalidatePath("/evolve/books");
}

export async function createBookSubmission(formData: FormData) {
  const { supabase, user } = await requireActiveUser("/evolve/books");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categories = parseCategories(String(formData.get("categories") ?? ""));
  const priceCents = parsePriceCents(String(formData.get("price_usd") ?? ""));
  const intent = formData.get("intent") === "submit" ? "submit" : "draft";
  const attested = formData.get("rights_attestation") === "on";
  const manuscriptFile = formData.get("manuscript");
  const coverFile = formData.get("cover");

  if (intent === "submit" && !attested) {
    console.error("Cannot submit a book without rights attestation");
    return;
  }

  const [manuscriptPath, coverPath] = await Promise.all([
    uploadIfPresent(supabase, "book-manuscripts", user.id, manuscriptFile),
    uploadIfPresent(supabase, "book-covers", user.id, coverFile),
  ]);

  const { error } = await supabase.from("books").insert({
    author_id: user.id,
    title,
    description,
    categories,
    manuscript_path: manuscriptPath,
    manuscript_filename:
      manuscriptFile instanceof File ? manuscriptFile.name : null,
    cover_path: coverPath,
    price_cents: priceCents,
    status: intent === "submit" ? "pending_review" : "draft",
    rights_attested_at: intent === "submit" ? new Date().toISOString() : null,
  });

  if (error) {
    console.error("Failed to create book submission", error);
  }

  revalidatePath("/evolve/books");
}

export async function updateBookSubmission(id: string, formData: FormData) {
  const { supabase, user } = await requireActiveUser("/evolve/books");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categories = parseCategories(String(formData.get("categories") ?? ""));
  const priceCents = parsePriceCents(String(formData.get("price_usd") ?? ""));
  const intent = formData.get("intent") === "submit" ? "submit" : "draft";
  const attested = formData.get("rights_attestation") === "on";
  const manuscriptFile = formData.get("manuscript");
  const coverFile = formData.get("cover");

  if (intent === "submit" && !attested) {
    console.error("Cannot submit a book without rights attestation");
    return;
  }

  const [manuscriptPath, coverPath] = await Promise.all([
    uploadIfPresent(supabase, "book-manuscripts", user.id, manuscriptFile),
    uploadIfPresent(supabase, "book-covers", user.id, coverFile),
  ]);

  const updates: Record<string, unknown> = {
    title,
    description,
    categories,
    price_cents: priceCents,
    status: intent === "submit" ? "pending_review" : "draft",
  };
  if (manuscriptPath) {
    updates.manuscript_path = manuscriptPath;
    updates.manuscript_filename =
      manuscriptFile instanceof File ? manuscriptFile.name : null;
  }
  if (coverPath) {
    updates.cover_path = coverPath;
  }
  if (intent === "submit") {
    updates.rights_attested_at = new Date().toISOString();
    updates.review_notes = null;
  }

  const { error } = await supabase
    .from("books")
    .update(updates)
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    console.error("Failed to update book submission", error);
  }

  revalidatePath("/evolve/books");
}
