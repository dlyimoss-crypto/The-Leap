"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { updatePassword, type AuthState } from "../sign-in/actions";

const initialState: AuthState = {};

export function ResetPasswordForm({ dict }: { dict: Dictionary["signIn"] }) {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <h1 className="text-2xl font-heading font-semibold">
        {dict.newPasswordTitle}
      </h1>
      <form action={formAction} className="w-full">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">{dict.newPassword}</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </Field>
          {state.error && <FieldError>{state.error}</FieldError>}
          <Button type="submit" className="w-full" disabled={pending}>
            {dict.saveNewPassword}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
