import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai";

export async function POST(request: Request) {
  const { jobTitle, industry } = await request.json();
  const summary = await generateSummary(jobTitle || "", industry || "");
  return NextResponse.json({ summary: summary || "" });
}
