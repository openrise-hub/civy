import { NextResponse } from "next/server";
import { analyzeATS } from "@/lib/ai";

export async function POST(request: Request) {
  const { resumeText } = await request.json();
  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json({ score: 0, issues: [], suggestions: [] });
  }
  const result = await analyzeATS(resumeText);
  return NextResponse.json(result || { score: 0, issues: [], suggestions: [] });
}
