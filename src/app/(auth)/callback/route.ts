import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const source = searchParams.get("source");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isSignup = source === "signup";
      const target = new URL(next, origin);

      if (next === "/reset-password") {
        return NextResponse.redirect(`${origin}/reset-password?recovered=true`);
      }

      if (isSignup) {
        target.searchParams.set("confirmed", "true");
      }

      return NextResponse.redirect(target.toString());
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    if (next === "/reset-password") {
      return NextResponse.redirect(`${origin}/reset-password?recovered=true`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
