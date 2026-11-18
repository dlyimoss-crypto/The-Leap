// COMMIT tab: commitments, journeys list, journey + day pages, CONNECT tab and churches.
// English is the source of truth: the type of every other language's
// `commit` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const commit = {};

export type CommitMessages = typeof commit;
