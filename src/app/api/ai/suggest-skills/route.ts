import { NextResponse } from "next/server";
import { suggestSkills } from "@/lib/ai";

export async function POST(request: Request) {
  const { jobTitle, industry } = await request.json();
  const skills = await suggestSkills(jobTitle || "", industry || "");
  return NextResponse.json({ skills: skills || [] });
}
