import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { analyzeATS } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resumeText, jobDescription, locale = "en" } = await request.json();
  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json({ error: "aiErrorAtsAnalysis" }, { status: 400 });
  }
  const result = await analyzeATS(resumeText, jobDescription || "", locale);
  if (!result) return NextResponse.json({ error: "aiErrorAtsAnalysis" }, { status: 500 });
  return NextResponse.json(result);
}
