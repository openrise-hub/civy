import { NextResponse } from "next/server";
import { cancelPremium } from "@/lib/profile/actions";
import crypto from "crypto";

async function verifyGumroadSignature(body: string, signature: string | null): Promise<boolean> {
  if (!signature) return false;
  const key = process.env.GUMROAD_ACCESS_TOKEN;
  if (!key) return false;
  const expected = crypto.createHmac("sha256", key).update(body).digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Gumroad-Signature");

  if (!(await verifyGumroadSignature(rawBody, signature))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const resourceName = body.resource_name as string;

  if (resourceName === "cancellation" || resourceName === "subscription_ended") {
    const userId = body.user_id as string;
    if (userId) {
      await cancelPremium(userId);
    }
  }

  if (resourceName === "refund") {
    const userId = body.user_id as string;
    if (userId) {
      await cancelPremium(userId);
    }
  }

  return NextResponse.json({ received: true });
}
