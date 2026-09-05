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
import { signIn, signUp, type AuthState } from "./actions";

const initialState: AuthState = {};

type Mode = "sign-in" | "sign-up";

export function SignInForm({
  initialMode = "sign-in",
}: {
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const isSignIn = mode === "sign-in";

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <h1 className="text-2xl font-heading font-semibold">
        {isSignIn ? "Welcome back" : "Create your account"}
      </h1>

      {/* Keyed by mode so useActionState resets — otherwise an error from
          the sign-in attempt would linger after switching to sign-up. */}
      <AuthFields key={mode} mode={mode} />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
      >
        {isSignIn
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </Button>
    </div>
  );
}

function AuthFields({ mode }: { mode: Mode }) {
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
            <FieldLabel htmlFor="displayName">Name</FieldLabel>
            <Input id="displayName" name="displayName" autoComplete="name" />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
          {isSignIn ? "Sign in" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
