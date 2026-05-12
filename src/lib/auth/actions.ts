"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type OAuthProvider = 
  | "google" 
  | "github" 
  | "discord" 
  | "linkedin_oidc" 
  | "azure" 
  | "slack_oidc";

export async function signInWithOAuth(provider: OAuthProvider, next?: string) {
  const supabase = await createClient();
  const headersList = await headers();
  // OAuth must use the actual origin so the PKCE code verifier cookie
  // is set on the same domain that receives the callback. Fall back to
  // NEXT_PUBLIC_SITE_URL only when origin is missing (e.g. server-to-server).
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

  const redirectTo = next 
    ? `${origin}/callback?next=${encodeURIComponent(next)}`
    : `${origin}/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithEmail(email: string, password: string, next?: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(next || "/dashboard");
}

export async function signUpWithEmail(email: string, password: string, displayName?: string, next?: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    headersList.get("origin") ||
    "";

  const emailRedirectTo = next
    ? `${origin}/callback?next=${next}`
    : `${origin}/callback`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || email.split("@")[0] },
      emailRedirectTo,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    headersList.get("origin") ||
    "";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resendVerification(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Delete the user's account entirely.
 * 1. Soft-delete all resumes
 * 2. Cancel active subscription (if any)
 * 3. Delete auth user via admin client
 */
export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    // 1. Soft-delete all resumes
    await supabase
      .from("resumes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("deleted_at", null);

    // 2. Cancel subscription if active
    const { getProfile, cancelSubscription } = await import(
      "@/lib/profile/actions"
    );
    const profile = await getProfile();
    if (profile?.paypal_subscription_id) {
      await cancelSubscription().catch(() => {});
    }

    // 3. Clear profile data
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();

    await adminSupabase
      .from("profiles")
      .update({
        is_premium: false,
        premium_tier: null,
        premium_until: null,
        paypal_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // 4. Delete auth user
    const { error: deleteError } =
      await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
      return { error: "Failed to delete account. Please contact support." };
    }

    // 5. Sign out locally
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Account deletion failed:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/login");
}

/**
 * Change the user's email address.
 * Supabase sends confirmation to both old and new email.
 */
export async function changeEmail(
  newEmail: string
): Promise<{ error?: string; success?: boolean }> {
  const trimmed = newEmail.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: "Please enter a valid email address" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    email: trimmed,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
