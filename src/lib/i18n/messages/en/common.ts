// Shared across areas: theme toggle, copy button, generic errors, relative/empty states.
// English is the source of truth: the type of every other language's
// `common` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const common = {
  themeToggle: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  /** aria-label for loading skeletons. */
  loading: "Loading",
  notFound: {
    title: "There's no next step here.",
    body: "This page doesn't exist, but wherever you are, there's still a next step waiting.",
    backToTheLeap: "Back to The Leap",
  },
  /** Supabase Auth errors, shown instead of Supabase's raw English. */
  authErrors: {
    invalidCredentials: "Invalid login credentials",
    emailNotConfirmed: "Email not confirmed",
    userAlreadyRegistered: "User already registered",
    weakPassword:
      "That password is too weak. Please choose a longer, harder-to-guess password.",
    samePassword: "New password should be different from the old password.",
    invalidEmail: "Please enter a valid email address.",
    rateLimit: "Too many attempts. Please wait a minute and try again.",
    generic: "Something went wrong. Please try again.",
  },
};

export type CommonMessages = typeof common;
