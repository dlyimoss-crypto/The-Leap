// Shared across areas: theme toggle, copy button, generic errors, relative/empty states.
// English is the source of truth: the type of every other language's
// `common` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const common = {};

export type CommonMessages = typeof common;
