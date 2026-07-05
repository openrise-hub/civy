import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { analyzeATS } from "@/lib/ai";

const EMPTY_RESULT = { score: 0, rewrittenResume: "", topIssues: [], keywordGaps: [] };

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resumeText, jobDescription, locale = "en" } = await request.json();
  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json(EMPTY_RESULT);
  }
  const result = await analyzeATS(resumeText, jobDescription || "", locale);
  return NextResponse.json(result || EMPTY_RESULT);
}
