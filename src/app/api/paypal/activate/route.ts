import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updatePremiumStatus } from "@/lib/profile/actions";
import { getPayPalSubscriptionDetails } from "@/lib/paypal";

const PLAN_IDS: Record<string, string> = {
  monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY || "",
  quarterly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_QUARTERLY || "",
  yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_YEARLY || "",
};

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, tier } = await request.json();

    if (!subscriptionId || !tier) {
      return NextResponse.json(
        { error: "Missing subscriptionId or tier" },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Server-to-server ver
    const subscription = await getPayPalSubscriptionDetails(subscriptionId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: "Could not verify subscription with PayPal" },
        { status: 400 }
      );
    }

    if (subscription.status !== "ACTIVE") {
      return NextResponse.json(
        { error: `Subscription is not active (Status: ${subscription.status})` },
        { status: 400 }
      );
    }

    // Verify the plan matches the requested tier
    const expectedPlanId = PLAN_IDS[tier];
    if (subscription.plan_id !== expectedPlanId) {
      return NextResponse.json(
        { error: "Plan mismatch. Please try again." },
        { status: 400 }
      );
    }

    // Update premium status
    const result = await updatePremiumStatus(user.id, subscriptionId, tier);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayPal activation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
