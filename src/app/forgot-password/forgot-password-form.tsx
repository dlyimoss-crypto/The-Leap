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
import {
  requestPasswordReset,
  type ResetRequestState,
} from "../sign-in/actions";

const initialState: ResetRequestState = {};

export function ForgotPasswordForm({
  dict,
  linkInvalid,
}: {
  dict: Dictionary["signIn"];
  linkInvalid: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-heading font-semibold">{dict.resetTitle}</h1>

      {state.sent ? (
        <p className="text-sm text-muted-foreground">{dict.resetLinkSent}</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{dict.resetIntro}</p>
          <form action={formAction} className="w-full text-left">
            <FieldGroup>
              {linkInvalid && !state.error && (
                <FieldError>{dict.resetLinkInvalid}</FieldError>
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
              {state.error && <FieldError>{state.error}</FieldError>}
              <Button type="submit" className="w-full" disabled={pending}>
                {dict.sendResetLink}
              </Button>
            </FieldGroup>
          </form>
        </>
      )}
    </div>
  );
}
