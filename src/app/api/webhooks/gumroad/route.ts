import { NextResponse } from "next/server";
import { cancelPremium } from "@/lib/profile/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resourceName = body.resource_name as string | undefined;

    console.log("Gumroad webhook received:", resourceName);

    if (resourceName === "cancellation" || resourceName === "subscription_ended") {
      const subscriptionId = body.subscription_id as string;
      if (!subscriptionId) {
        return NextResponse.json({ error: "missing subscription_id" }, { status: 400 });
      }

      const userId = body.user_id as string;
      if (userId) {
        await cancelPremium(userId);
        console.log(`Premium cancelled for user ${userId} via Gumroad webhook`);
      }
    }

    if (resourceName === "refund") {
      const subscriptionId = body.subscription_id as string;
      const userId = body.user_id as string;
      if (userId) {
        await cancelPremium(userId);
        console.log(`Premium cancelled for user ${userId} due to refund`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Gumroad webhook error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
