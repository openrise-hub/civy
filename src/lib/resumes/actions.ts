"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

import { RESUME_LIMITS } from "@/constants/limits";
import { getProfile } from "@/lib/profile/actions";

export async function createResume(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Server-side limit check
  const [countResult, profile] = await Promise.all([
    supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    getProfile(),
  ]);

  const resumeCount = countResult.count ?? 0;
  const isPremium = profile?.is_premium ?? false;
  const maxResumes = isPremium ? RESUME_LIMITS.PRO_MAX_RESUMES : RESUME_LIMITS.FREE_MAX_RESUMES;

  if (resumeCount >= maxResumes) {
    throw new Error("Resume limit reached. Please upgrade to Pro.");
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
  // Use the user client ONLY to verify authentication
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Use the admin client for the actual update to bypass RLS.
  // This is safe because this is a "use server" action (never runs in browser)
  // and we've already verified the user owns this operation above.
  const admin = createAdminClient();

  const { error } = await admin
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

export type ResumeData = {
  id: string;
  title: string;
  data: Record<string, unknown>;
  is_public: boolean;
  slug: string | null;
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getResume(id: string): Promise<ResumeData | null> {
  // Validate UUID format before querying to prevent database errors
  if (!UUID_REGEX.test(id)) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, data, is_public, slug")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Failed to fetch resume:", error.message);
    return null;
  }

  return data;
}

import { saveResumeUpdatesSchema } from "./resume-schema";

export async function saveResume(
  id: string,
  updates: { title?: string; data?: Record<string, unknown> }
): Promise<{ error?: string }> {
  // Server-side validation
  const parsed = saveResumeUpdatesSchema.safeParse(updates);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    console.warn("saveResume validation failed:", parsed.error.issues);
    return { error: firstError };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("resumes")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to save resume:", error.message);
    return { error: error.message };
  }

  return {};
}

// ============================================
// RESUME MANAGEMENT ACTIONS
// ============================================

/**
 * Duplicate a resume. Creates a new row with "Copy of {title}" and a deep copy of the data.
 */
export async function duplicateResume(
  id: string
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch the source resume
  const { data: source, error: fetchError } = await supabase
    .from("resumes")
    .select("title, data")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (fetchError || !source) {
    return { error: "Resume not found" };
  }

  // Check resume limit
  const [countResult, profile] = await Promise.all([
    supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    getProfile(),
  ]);

  const resumeCount = countResult.count ?? 0;
  const isPremium = profile?.is_premium ?? false;
  const maxResumes = isPremium
    ? RESUME_LIMITS.PRO_MAX_RESUMES
    : RESUME_LIMITS.FREE_MAX_RESUMES;

  if (resumeCount >= maxResumes) {
    return { error: "Resume limit reached. Please upgrade to Pro." };
  }

  // Insert the duplicate
  const { data: newResume, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `Copy of ${source.title}`,
      data: JSON.parse(JSON.stringify(source.data)), // deep copy
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to duplicate resume:", insertError.message);
    return { error: insertError.message };
  }

  revalidatePath("/dashboard");
  return { id: newResume.id };
}

/**
 * Get soft-deleted resumes within the 3-day recovery window.
 */
export type DeletedResumeItem = {
  id: string;
  title: string;
  deleted_at: string;
};

export async function getDeletedResumes(): Promise<DeletedResumeItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const admin = createAdminClient();

  const threeDaysAgo = new Date(
    Date.now() - 3 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await admin
    .from("resumes")
    .select("id, title, deleted_at")
    .eq("user_id", user.id)
    .not("deleted_at", "is", null)
    .gte("deleted_at", threeDaysAgo)
    .order("deleted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch deleted resumes:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Restore a soft-deleted resume by setting deleted_at back to NULL.
 */
export async function restoreResume(
  id: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check resume limit before restoring
  const [countResult, profile] = await Promise.all([
    supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    getProfile(),
  ]);

  const resumeCount = countResult.count ?? 0;
  const isPremium = profile?.is_premium ?? false;
  const maxResumes = isPremium
    ? RESUME_LIMITS.PRO_MAX_RESUMES
    : RESUME_LIMITS.FREE_MAX_RESUMES;

  if (resumeCount >= maxResumes) {
    return { error: "Resume limit reached. Please upgrade to Pro." };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("resumes")
    .update({ deleted_at: null })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to restore resume:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/trash");
  return {};
}

// ============================================
// PUBLIC SHARING ACTIONS
// ============================================

export type PublicResumeData = {
  id: string;
  title: string;
  data: Record<string, unknown>;
};

/**
 * Get a public resume by its share slug.
 * No authentication required - but resume must be public.
 */
export async function getPublicResume(slug: string): Promise<PublicResumeData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, data")
    .eq("slug", slug)
    .eq("is_public", true)
    .is("deleted_at", null)
    .single();

  if (error) {
    // Not found or not public
    return null;
  }

  return data;
}

/**
 * Generate a unique 8-character slug
 */
function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * Toggle resume visibility (public/private).
 * If making public and no slug exists, generate one.
 */
export async function toggleResumeVisibility(
  id: string
): Promise<{ isPublic: boolean; slug: string | null; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isPublic: false, slug: null, error: "Not authenticated" };
  }

  // Get current state
  const { data: current, error: fetchError } = await supabase
    .from("resumes")
    .select("is_public, slug")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !current) {
    return { isPublic: false, slug: null, error: "Resume not found" };
  }

  const newIsPublic = !current.is_public;
  const slug = newIsPublic && !current.slug ? generateSlug() : current.slug;

  const { error: updateError } = await supabase
    .from("resumes")
    .update({ is_public: newIsPublic, slug })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return { isPublic: current.is_public, slug: current.slug, error: updateError.message };
  }

  revalidatePath("/dashboard");
  return { isPublic: newIsPublic, slug };
}

/**
 * Regenerate share slug (invalidates old public link).
 */
export async function regenerateSlug(
  id: string
): Promise<{ slug: string | null; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { slug: null, error: "Not authenticated" };
  }

  const newSlug = generateSlug();

  const { error } = await supabase
    .from("resumes")
    .update({ slug: newSlug })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { slug: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { slug: newSlug };
}

