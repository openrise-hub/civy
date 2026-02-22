"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RESUME_LIMITS } from "@/constants/limits";
import { getProfile } from "@/lib/profile/actions";

export type Folder = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export async function getFolders(): Promise<Folder[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch folders:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createFolder(name: string, color: string | null = null): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Server-side limit check
  const [countResult, profile] = await Promise.all([
    supabase
      .from("folders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    getProfile(),
  ]);

  const folderCount = countResult.count ?? 0;
  const isPremium = profile?.is_premium ?? false;
  const maxFolders = isPremium ? RESUME_LIMITS.PRO_MAX_FOLDERS : RESUME_LIMITS.FREE_MAX_FOLDERS;

  if (folderCount >= maxFolders) {
    return { error: `Folder limit reached. Maximum ${maxFolders} allowed for your plan.` };
  }

  const { data, error } = await supabase
    .from("folders")
    .insert({
      user_id: user.id,
      name: name.trim(),
      color,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create folder:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { id: data.id };
}

export async function updateFolder(id: string, name: string, color?: string | null): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates: { name: string; color?: string | null } = { name: name.trim() };
  if (color !== undefined) {
    updates.color = color;
  }

  const { error } = await supabase
    .from("folders")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update folder:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}

export async function deleteFolder(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete folder:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}
