import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { generateSummary } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { jobTitle, industry } = await request.json();
  const summary = await generateSummary(jobTitle || "", industry || "");
  return NextResponse.json({ summary: summary || "" });
}
