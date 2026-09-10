"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { COUNTRIES } from "@/lib/countries";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { signIn, signUp, type AuthState } from "./actions";

const initialState: AuthState = {};

type Mode = "sign-in" | "sign-up";

export function SignInForm({
  initialMode = "sign-in",
  dict,
}: {
  initialMode?: Mode;
  dict: Dictionary["signIn"];
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const isSignIn = mode === "sign-in";

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <h1 className="text-2xl font-heading font-semibold">
        {isSignIn ? dict.welcomeBack : dict.createAccount}
      </h1>

      {/* Keyed by mode so useActionState resets — otherwise an error from
          the sign-in attempt would linger after switching to sign-up. */}
      <AuthFields key={mode} mode={mode} dict={dict} />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
      >
        {isSignIn ? dict.newHere : dict.alreadyHaveAccount}
      </Button>
    </div>
  );
}

function AuthFields({
  mode,
  dict,
}: {
  mode: Mode;
  dict: Dictionary["signIn"];
}) {
  const isSignIn = mode === "sign-in";
  const [state, formAction, pending] = useActionState(
    isSignIn ? signIn : signUp,
    initialState,
  );

  return (
    <form action={formAction} className="w-full">
      <FieldGroup>
        {!isSignIn && (
          <Field>
            <FieldLabel htmlFor="displayName">{dict.name}</FieldLabel>
            <Input id="displayName" name="displayName" autoComplete="name" />
          </Field>
        )}
        {!isSignIn && (
          <Field>
            <FieldLabel htmlFor="nationality">{dict.nationality}</FieldLabel>
            <select
              id="nationality"
              name="nationality"
              autoComplete="country"
              required
              defaultValue=""
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            >
              <option value="" disabled>
                {dict.selectNationality}
              </option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">{dict.email}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">{dict.password}</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            minLength={8}
            required
          />
        </Field>
        {state.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" className="w-full" disabled={pending}>
          {isSignIn ? dict.signInButton : dict.createAccountButton}
        </Button>
      </FieldGroup>
    </form>
  );
}
