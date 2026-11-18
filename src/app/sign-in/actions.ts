"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/countries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));

// awaitingConfirmation holds the email address a confirmation link was sent
// to — set after sign-up, or when someone signs in before confirming.
export type AuthState = { error?: string; awaitingConfirmation?: string };

// Supabase's own error text is English-only (and sometimes technical), so
// show a dictionary message instead: the common cases by error code, then a
// generic fallback. The raw error is logged for debugging.
async function authErrorMessage(error: AuthError): Promise<string> {
  const t = getDictionary(await getLocale()).common.authErrors;
  switch (error.code) {
    case "invalid_credentials":
      return t.invalidCredentials;
    case "email_not_confirmed":
      return t.emailNotConfirmed;
    case "user_already_exists":
    case "email_exists":
      return t.userAlreadyRegistered;
    case "weak_password":
      return t.weakPassword;
    case "same_password":
      return t.samePassword;
    case "email_address_invalid":
    case "validation_failed":
      return t.invalidEmail;
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
    case "over_sms_send_rate_limit":
      return t.rateLimit;
  }
  if (error.status === 429) {
    return t.rateLimit;
  }
  console.error("Unmapped auth error", error.code, error.message);
  return t.generic;
}

// Where an emailed confirmation link lands. /auth/confirm turns the link
// into a session, then forwards on to the gospel invite like a sign-in does.
async function confirmRedirectUrl() {
  const origin = (await headers()).get("origin") ?? "";
  return `${origin}/auth/confirm?next=${encodeURIComponent("/?gospel_invite=1")}`;
}

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

  if (error?.code === "email_not_confirmed") {
    return { awaitingConfirmation: email };
  }

  if (error) {
    return { error: await authErrorMessage(error) };
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
      // preferred_language: the language picked before signing up, so the
      // new profile starts in it (read by handle_new_user, migration 0038).
      data: {
        display_name: displayName || null,
        nationality,
        preferred_language: await getLocale(),
      },
      emailRedirectTo: await confirmRedirectUrl(),
    },
  });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  // With "Confirm email" on, Supabase holds the session back until the
  // emailed link is clicked.
  if (!data.session) {
    return { awaitingConfirmation: email };
  }

  redirect("/?gospel_invite=1");
}

export type ResendState = { error?: string; sent?: boolean };

export async function resendConfirmation(
  _prevState: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: await confirmRedirectUrl() },
  });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  return { sent: true };
}

export type ResetRequestState = { error?: string; sent?: boolean };

export async function requestPasswordReset(
  _prevState: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();

  // The emailed link lands on /auth/confirm, which turns it into a session
  // and forwards to /reset-password. Built from the request's own origin so
  // it points at whichever deployment (prod, preview, localhost) sent it.
  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  // Same answer whether or not the email has an account, so this form
  // can't be used to find out who is signed up.
  return { sent: true };
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
