import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { generateResume, type ResumeInput } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { locale = "en", ...input } = body as ResumeInput & { locale?: string };

  if (!input.fullName || !input.jobTitle) {
    return NextResponse.json({ error: "aiErrorGenerateResume" }, { status: 400 });
  }

  const result = await generateResume(input, locale);
  if (!result) {
    return NextResponse.json({ error: "aiErrorGenerateResume" }, { status: 500 });
  }

  return NextResponse.json(result);
}
