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
  const origin = headersList.get("origin") || "";

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

export async function signUpWithEmail(email: string, password: string, next?: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: next 
        ? `${origin}/callback?next=${encodeURIComponent(next)}`
        : `${origin}/callback`,
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
