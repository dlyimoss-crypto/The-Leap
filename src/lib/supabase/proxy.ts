import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { keepAliveFetch } from "./keep-alive-fetch";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: keepAliveFetch },
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
  let userId: string | undefined;
  try {
    const { data } = await supabase.auth.getClaims();
    userId = data?.claims?.sub;
  } catch {
    // Leave supabaseResponse (and the untouched request cookies) as-is.
  }

  if (userId) {
    await recordDailyVisit(supabase, request, supabaseResponse, userId);
  }

  return supabaseResponse;
}

const VISIT_COOKIE = "leap_visit";

// Records one app_visits row per user per day for the admin usage report.
// A cookie holding "<user id>:<date>" means today's visit is already in, so
// only the first request of the day pays for the write — and a second
// account signing in on the same browser still gets counted.
async function recordDailyVisit(
  supabase: ReturnType<typeof createServerClient>,
  request: NextRequest,
  response: NextResponse,
  userId: string,
) {
  const today = new Date().toISOString().slice(0, 10);
  const marker = `${userId}:${today}`;
  if (request.cookies.get(VISIT_COOKIE)?.value === marker) {
    return;
  }

  const { error } = await supabase
    .from("app_visits")
    .upsert(
      { user_id: userId, visited_on: today },
      { onConflict: "user_id,visited_on", ignoreDuplicates: true },
    );

  // Set the cookie even on failure: retrying on every request would put a
  // failing write in front of each navigation. Missing a day's count is the
  // cheaper outcome.
  if (error) {
    console.error("Failed to record app visit", error);
  }
  response.cookies.set(VISIT_COOKIE, marker, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 48,
  });
}
