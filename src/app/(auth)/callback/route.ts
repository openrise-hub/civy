import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next === "/reset-password") {
        return NextResponse.redirect(`${origin}/reset-password?recovered=true`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Password recovery flow: GoTrue sets the session cookie before redirecting,
  // so the code exchange step is skipped. Check if user is already authenticated.
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    if (next === "/reset-password") {
      return NextResponse.redirect(`${origin}/reset-password?recovered=true`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
