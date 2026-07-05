import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { suggestSkills } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resumeText, locale = "en", jobTitle, industry } = await request.json();
  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json({ skills: [], reasoning: "" });
  }

  const result = await suggestSkills(resumeText, locale, jobTitle, industry);
  return NextResponse.json(result || { skills: [], reasoning: "" });
}
