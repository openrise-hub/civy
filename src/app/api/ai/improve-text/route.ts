import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { improveText } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { text, locale = "en" } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ text: "" });
  }
  const improved = await improveText(text, locale);
  return NextResponse.json({ text: improved || "" });
}
