import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyLicense, getProductId, type GumroadProduct } from "@/lib/gumroad";
import { updatePremiumStatus } from "@/lib/profile/actions";

function parseTier(permalink: string): GumroadProduct | null {
  if (permalink.includes("monthly")) return "monthly";
  if (permalink.includes("quarterly")) return "quarterly";
  if (permalink.includes("yearly")) return "yearly";
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get("license_key");
  const permalink = searchParams.get("permalink");
  const userId = searchParams.get("user_id");

  if (!licenseKey || !permalink) {
    return NextResponse.redirect(
      new URL("/upgrade?error=missing_params", request.url)
    );
  }

  const tier = parseTier(permalink);
  if (!tier) {
    return NextResponse.redirect(
      new URL("/upgrade?error=invalid_product", request.url)
    );
  }

  const productId = await getProductId(permalink);
  if (!productId) {
    return NextResponse.redirect(
      new URL("/upgrade?error=product_not_found", request.url)
    );
  }

  const result = await verifyLicense(productId, licenseKey);
  if (!result.success || !result.purchase) {
    return NextResponse.redirect(
      new URL("/upgrade?error=license_invalid", request.url)
    );
  }

  const purchase = result.purchase;
  const email = purchase.email as string;

  let targetUserId = userId;
  if (!targetUserId && email) {
    const supabase = await createClient();
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (user) targetUserId = user.id;
  }

  if (!targetUserId) {
    return NextResponse.redirect(
      new URL("/login?error=user_not_found", request.url)
    );
  }

  const subscriptionId = purchase.subscription_id as string | undefined;
  await updatePremiumStatus(targetUserId, subscriptionId || "", tier);

  return NextResponse.redirect(new URL("/dashboard/settings?premium=activated", request.url));
}
