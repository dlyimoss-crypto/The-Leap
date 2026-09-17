import { Agent, fetch as undiciFetch } from "undici";

// Next.js patches the global `fetch` for its own Data Cache bookkeeping, so
// setting a global undici dispatcher (e.g. in instrumentation.ts) doesn't
// reliably reach requests made through it. Supabase's client accepts its
// own `fetch` override, so we hand it one built directly on undici's fetch,
// bound to an Agent with a keep-alive timeout well past the 4s default —
// long enough to survive normal gaps between page navigations and reuse
// the TCP+TLS connection instead of paying a fresh handshake (600-1400ms)
// on nearly every request to Supabase.
const agent = new Agent({
  keepAliveTimeout: 30_000,
  keepAliveMaxTimeout: 60_000,
});

export const keepAliveFetch: typeof fetch = (input, init) =>
  undiciFetch(input as never, { ...init, dispatcher: agent } as never) as unknown as Promise<Response>;
