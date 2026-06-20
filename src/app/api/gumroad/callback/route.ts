import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/upgrade?error=gumroad_oauth_failed", request.url));
  }

  return NextResponse.redirect(new URL("/upgrade?gumroad_connected=true", request.url));
}
