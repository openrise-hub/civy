"use server";

import { getUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getTemplateList } from "@/lib/templates/registry";
import { getProfile } from "@/lib/profile/actions";
import { RESUME_LIMITS, FREE_TEMPLATES } from "@/constants/limits";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import type { Item } from "@/types/resume";

function suggestTemplate(industry: string): string {
  const entries = getTemplateList();
  const freeOnly = entries.filter((e) => FREE_TEMPLATES.includes(e.name.toLowerCase() as never));
  const matching = freeOnly.filter((e) => e.industries.includes(industry));
  return (matching[0]?.name ?? "modern").toLowerCase();
}

function makeId(): string {
  return uuidv4();
}

export async function createOnboardingResume(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const fullName = (formData.get("fullName") as string) || "";
  const jobTitle = (formData.get("jobTitle") as string) || "";
  const email = (formData.get("email") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const location = (formData.get("location") as string) || "";
  const linkedin = (formData.get("linkedin") as string) || "";
  const website = (formData.get("website") as string) || "";
  const summary = (formData.get("summary") as string) || "";
  const industry = (formData.get("industry") as string) || "";

  if (!fullName) {
    throw new Error("Full name is required");
  }

  const supabase = await createClient();
  const profile = await getProfile();
  const isPremium = profile?.is_premium ?? false;
  const maxResumes = isPremium ? RESUME_LIMITS.PRO_MAX_RESUMES : RESUME_LIMITS.FREE_MAX_RESUMES;

  const { count, error: countError } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (countError) {
    throw new Error("Failed to check resume limits");
  }

  if (count !== null && count >= maxResumes) {
    throw new Error(isPremium ? "LIMIT_PRO" : "LIMIT_FREE");
  }

  const suggestedTemplate = suggestTemplate(industry);

  const details: Item[] = [];
  if (email) {
    details.push({ id: makeId(), visible: true, type: "email", value: email } as Item);
  }
  if (phone) {
    details.push({ id: makeId(), visible: true, type: "phone", value: phone } as Item);
  }
  if (location) {
    details.push({ id: makeId(), visible: true, type: "location", value: location } as Item);
  }
  if (linkedin) {
    details.push({
      id: makeId(),
      visible: true,
      type: "link",
      value: { label: "LinkedIn", url: linkedin },
    } as Item);
  }
  if (website) {
    details.push({
      id: makeId(),
      visible: true,
      type: "link",
      value: { label: "Website", url: website },
    } as Item);
  }

  const sections: Array<{
    id: string;
    title: string;
    visible: boolean;
    content: { layout: string; items: Item[] };
  }> = [];

  if (summary) {
    sections.push({
      id: makeId(),
      title: "Professional Summary",
      visible: true,
      content: {
        layout: "list",
        items: [
          { id: makeId(), visible: true, type: "description", value: summary } as Item,
        ],
      },
    });
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${fullName}'s Resume`,
      data: {
        metadata: {
          template: suggestedTemplate,
          showFooter: false,
          showTopNote: false,
          typography: { fontFamily: "inter", fontSize: "md" },
          colors: {
            background: "#ffffff",
            text: "#1f2937",
            accents: ["#2563eb", "#3b82f6", "#e5e7eb", "#6b7280"],
          },
        },
        personal: { fullName, jobTitle, details },
        sections,
      },
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Failed to create resume");
  }

  redirect(`/editor/${data.id}`);
}
