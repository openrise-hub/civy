import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { analyzeATS } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resumeText, locale = "en" } = await request.json();
  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json({ score: 0, issues: [], suggestions: [] });
  }
  const result = await analyzeATS(resumeText, locale);
  return NextResponse.json(result || { score: 0, issues: [], suggestions: [] });
}
