"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ResumeListItem = {
  id: string;
  title: string;
  updated_at: string;
  is_public: boolean;
  slug: string | null;
};

const defaultResumeData = {
  metadata: {
    template: "modern",
    typography: { fontFamily: "inter", fontSize: "md" },
    colors: {
      background: "#ffffff",
      text: "#1f2937",
      accents: ["#2563eb", "#3b82f6", "#e5e7eb", "#6b7280"],
    },
  },
  personal: {
    fullName: "",
    details: [],
  },
  sections: [],
};

export async function getResumes(): Promise<ResumeListItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, updated_at, is_public, slug")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch resumes:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createResume(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "Untitled Resume",
      data: defaultResumeData,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create resume:", error.message);
    throw new Error(error.message);
  }

  redirect(`/editor/${data.id}`);
}

export async function deleteResume(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("resumes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete resume:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}
