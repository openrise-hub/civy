"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getProfile } from "@/lib/profile/actions";
import type { Resume } from "@/types/resume";

export type CustomTemplate = {
  id: string;
  user_id: string;
  name: string;
  metadata: Resume["metadata"];
  created_at: string;
  updated_at: string;
};

/**
 * Fetch all custom templates for the authenticated user.
 */
export async function getCustomTemplates(): Promise<CustomTemplate[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("custom_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching custom templates:", error);
    throw new Error("Failed to fetch custom templates");
  }

  // Double-checking parsing just in case
  return data as CustomTemplate[];
}

/**
 * Save a new custom template for the authenticated user.
 */
export async function saveCustomTemplate(
  name: string, 
  metadata: Resume["metadata"]
): Promise<{ data?: CustomTemplate; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check Limits
  const profile = await getProfile();
  const isPremium = profile?.is_premium ?? false;
  const limit = isPremium ? 50 : 2;

  const { count, error: countError } = await supabase
    .from("custom_templates")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error checking limits:", countError);
    return { error: "Failed to check template limits." };
  }

  if (count !== null && count >= limit) {
    return { 
      error: isPremium 
        ? "LIMIT_PRO" 
        : "LIMIT_FREE" 
    };
  }

  const { data, error } = await supabase
    .from("custom_templates")
    .insert({
      user_id: user.id,
      name,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving custom template:", error);
    return { error: "Failed to save custom template." };
  }

  revalidatePath("/");

  return { data: data as CustomTemplate };
}

/**
 * Delete a custom template.
 */
export async function deleteCustomTemplate(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("custom_templates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting custom template:", error);
    throw new Error("Failed to delete custom template");
  }

  revalidatePath("/");
}
