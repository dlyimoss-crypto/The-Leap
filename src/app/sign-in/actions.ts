"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/countries";

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));

export type AuthState = { error?: string };

export async function signIn(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/?gospel_invite=1");
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const nationalityInput = String(formData.get("nationality") ?? "").trim().toUpperCase();
  const nationality = VALID_COUNTRY_CODES.has(nationalityInput) ? nationalityInput : null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || null, nationality },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      error:
        "Account created, but sign-in requires email confirmation, which isn't enabled for this app yet. Contact support.",
    };
  }

  redirect("/?gospel_invite=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
