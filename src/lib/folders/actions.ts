"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
