import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Gumroad OAuth error:", error);
    return NextResponse.redirect(new URL("/upgrade?error=gumroad_oauth_failed", request.url));
  }

  console.log("Gumroad OAuth callback received code:", code?.slice(0, 10) + "...");
  return NextResponse.redirect(new URL("/upgrade?gumroad_connected=true", request.url));
}
