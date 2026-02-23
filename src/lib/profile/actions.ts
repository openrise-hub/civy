"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type Profile = {
  id: string;
  is_premium: boolean;
  premium_tier: "monthly" | "quarterly" | "yearly" | null;
  premium_until: string | null;
  paypal_subscription_id: string | null;
  locale: string;
  theme: string;
};

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    // Profile might not exist yet - return default
    if (error.code === "PGRST116") {
      return {
        id: user.id,
        is_premium: false,
        premium_tier: null,
        premium_until: null,
        paypal_subscription_id: null,
        locale: "en",
        theme: "system",
      };
    }
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Update user's premium status (Admin/Server-only)
 * Uses Service Role Key to bypass RLS
 */
export async function updatePremiumStatus(
  userId: string,
  subscriptionId: string,
  tier: "monthly" | "quarterly" | "yearly"
): Promise<{ error?: string }> {
  // Use Admin Client because users should NOT be able to update their own profile's is_premium field
  const supabase = createAdminClient();

  // Calculate premium_until based on tier
  const now = new Date();
  let premiumUntil: Date;
  
  switch (tier) {
    case "monthly":
      premiumUntil = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case "quarterly":
      premiumUntil = new Date(now.setMonth(now.getMonth() + 3));
      break;
    case "yearly":
      premiumUntil = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      is_premium: true,
      premium_tier: tier,
      premium_until: premiumUntil.toISOString(),
      paypal_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error updating premium status:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return {};
}

/**
 * Cancel premium subscription (Admin/Server-only)
 */
export async function cancelPremium(userId: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: false,
      premium_tier: null,
      paypal_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error canceling premium:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return {};
}

/**
 * Update the user's display name in Supabase user metadata.
 */
export async function updateDisplayName(
  name: string
): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 100) {
    return { error: "Display name must be between 1 and 100 characters" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    data: { display_name: trimmed },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return {};
}

/**
 * User-initiated subscription cancellation.
 */
export async function cancelSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const profile = await getProfile();
  if (!profile?.paypal_subscription_id) {
    return { error: "No active subscription found" };
  }

  // Cancel via PayPal API
  const { cancelPayPalSubscription } = await import("@/lib/paypal");
  const paypalResult = await cancelPayPalSubscription(
    profile.paypal_subscription_id
  );

  if (paypalResult.error) {
    return { error: paypalResult.error };
  }

  // Update local DB
  const dbResult = await cancelPremium(user.id);
  if (dbResult.error) {
    return { error: dbResult.error };
  }

  revalidatePath("/", "layout");
  return {};
}

type PricingTier = "monthly" | "quarterly" | "yearly";

const PLAN_IDS: Record<PricingTier, string> = {
  monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY || "",
  quarterly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_QUARTERLY || "",
  yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_YEARLY || "",
};

/**
 * Change subscription to a different tier.
 * Returns an approval URL the user must visit to confirm.
 */
export async function changeSubscriptionTier(
  newTier: PricingTier
): Promise<{ approvalUrl?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const profile = await getProfile();
  if (!profile?.paypal_subscription_id) {
    return { error: "No active subscription found" };
  }

  const newPlanId = PLAN_IDS[newTier];
  if (!newPlanId) {
    return { error: "Invalid plan tier" };
  }

  const { revisePayPalSubscription } = await import("@/lib/paypal");
  const result = await revisePayPalSubscription(
    profile.paypal_subscription_id,
    newPlanId
  );

  if (result.error) {
    return { error: result.error };
  }

  return { approvalUrl: result.approvalUrl };
}

/**
 * Update user preferences (locale and theme)
 */
export async function updatePreferences(updates: {
  locale?: string;
  theme?: string;
}): Promise<{ error?: string }> {
  if (!updates.locale && !updates.theme) {
    return {};
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating preferences:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return {};
}

/**
 * Fetch dynamic pricing data for all active plans.
 */
export async function getPricingPlans(): Promise<Record<PricingTier, string>> {
  const { getPayPalPlanDetails } = await import("@/lib/paypal");
  
  try {
    const [monthly, quarterly, yearly] = await Promise.all([
      getPayPalPlanDetails(PLAN_IDS.monthly),
      getPayPalPlanDetails(PLAN_IDS.quarterly),
      getPayPalPlanDetails(PLAN_IDS.yearly),
    ]);

    return {
      monthly: monthly?.value || "3.99",
      quarterly: quarterly?.value || "9.99",
      yearly: yearly?.value || "29.99",
    };
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return {
      monthly: "3.99",
      quarterly: "9.99",
      yearly: "29.99",
    };
  }
}
