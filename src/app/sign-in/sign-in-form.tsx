"use client";

import Link from "next/link";
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
import {
  resendConfirmation,
  signIn,
  signUp,
  type AuthState,
  type ResendState,
} from "./actions";

const initialState: AuthState = {};
const initialResendState: ResendState = {};

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

  if (state.awaitingConfirmation) {
    return <CheckEmail email={state.awaitingConfirmation} dict={dict} />;
  }

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
        {isSignIn && (
          <Button
            render={<Link href="/forgot-password" />}
            nativeButton={false}
            variant="link"
            size="sm"
          >
            {dict.forgotPassword}
          </Button>
        )}
      </FieldGroup>
    </form>
  );
}

function CheckEmail({
  email,
  dict,
}: {
  email: string;
  dict: Dictionary["signIn"];
}) {
  const [state, formAction, pending] = useActionState(
    resendConfirmation,
    initialResendState,
  );

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="text-lg font-heading font-semibold">
        {dict.checkEmailTitle}
      </h2>
      <p className="text-sm text-muted-foreground">
        {dict.checkEmailSentTo}{" "}
        <span className="font-medium text-foreground">{email}</span>.{" "}
        {dict.checkEmailBody}
      </p>
      <form action={formAction} className="w-full">
        <input type="hidden" name="email" value={email} />
        <FieldGroup>
          {state.error && <FieldError>{state.error}</FieldError>}
          {state.sent && (
            <p className="text-sm text-muted-foreground">
              {dict.confirmationResent}
            </p>
          )}
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={pending}
          >
            {dict.resendConfirmation}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
