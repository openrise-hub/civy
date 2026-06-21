import { NextResponse } from "next/server";
import { improveText } from "@/lib/ai";

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ text: "" });
  }
  const improved = await improveText(text);
  return NextResponse.json({ text: improved || "" });
}
