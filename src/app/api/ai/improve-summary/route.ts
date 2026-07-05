import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { improveSummary } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentSummary, resumeText, locale = "en", jobTitle, industry } = await request.json();
  if (!currentSummary || typeof currentSummary !== "string") {
    return NextResponse.json({ error: "aiErrorImproveSummary" }, { status: 400 });
  }

  const result = await improveSummary(currentSummary, resumeText, locale, jobTitle, industry);
  if (!result) return NextResponse.json({ error: "aiErrorImproveSummary" }, { status: 500 });
  return NextResponse.json(result);
}
