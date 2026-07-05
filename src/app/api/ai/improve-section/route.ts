import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/actions";
import { improveSection } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, sectionType, locale = "en", jobTitle, industry } = await request.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "aiErrorImproveSection" }, { status: 400 });
  }

  const result = await improveSection(items, sectionType || "", locale, jobTitle, industry);
  if (!result) return NextResponse.json({ error: "aiErrorImproveSection" }, { status: 500 });
  return NextResponse.json({ items: result });
}
