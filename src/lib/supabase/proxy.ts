import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refreshes the session cookie if it's expired. Required reading for any
  // Supabase + Next.js middleware — skipping this call is a silent no-op.
  //
  // getClaims() rather than getUser(): this project signs JWTs with an
  // asymmetric key (Settings > JWT Keys), so getClaims() verifies the
  // token's signature locally via WebCrypto instead of making a network
  // round trip to ask Supabase's Auth server "who is this" — cutting a
  // full request/response cycle off every navigation. It still refreshes
  // an expiring session first, same as getUser() did. This is safe here
  // specifically because proxy never gates access on the result (it only
  // refreshes the cookie) — every place that actually decides whether a
  // user is let in (requireUser() and friends, in authorize.ts) still
  // calls the fully server-verified getUser().
  //
  // Swallow errors here: a transient network blip or refresh-token race
  // shouldn't drop the existing cookie. Worst case this request sees a
  // stale session and the next proxy pass refreshes it.
  try {
    await supabase.auth.getClaims();
  } catch {
    // Leave supabaseResponse (and the untouched request cookies) as-is.
  }

  return supabaseResponse;
}
