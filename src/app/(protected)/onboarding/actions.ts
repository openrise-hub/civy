"use server";

import { getUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getTemplateList } from "@/lib/templates/registry";
import { getProfile } from "@/lib/profile/actions";
import { RESUME_LIMITS, FREE_TEMPLATES } from "@/constants/limits";
import { v4 as uuidv4 } from "uuid";
import type { Item } from "@/types/resume";
import { generateResume, type ResumeInput, type ResumeOutput } from "@/lib/ai";

function suggestTemplate(industry: string): string {
  const entries = getTemplateList();
  const freeOnly = entries.filter((e) => FREE_TEMPLATES.includes(e.name.toLowerCase() as never));
  const matching = freeOnly.filter((e) => e.industries.includes(industry));
  return (matching[0]?.name ?? "modern").toLowerCase();
}

function makeId(): string {
  return uuidv4();
}

function buildSections(aiOutput: ResumeOutput, input: ResumeInput): Array<{
  id: string;
  title: string;
  visible: boolean;
  content: { layout: string; items: Item[] };
}> {
  const sections: Array<{
    id: string;
    title: string;
    visible: boolean;
    content: { layout: string; items: Item[] };
  }> = [];

  if (aiOutput.summary) {
    sections.push({
      id: makeId(),
      title: "Professional Summary",
      visible: true,
      content: {
        layout: "list",
        items: [
          { id: makeId(), visible: true, type: "description", value: aiOutput.summary } as Item,
        ],
      },
    });
  }

  if (aiOutput.experience && aiOutput.experience.length > 0) {
    const items: Item[] = aiOutput.experience.map((exp) => {
      const heading = `${exp.title} at ${exp.company}`;
      return {
        id: makeId(),
        visible: true,
        type: "description",
        value: `${heading}\n${exp.dateRange}\n${exp.description}`,
      } as Item;
    });
    sections.push({
      id: makeId(),
      title: "Experience",
      visible: true,
      content: { layout: "list", items },
    });
  }

  if (aiOutput.projects && aiOutput.projects.length > 0) {
    const items: Item[] = aiOutput.projects.map((proj) => ({
      id: makeId(),
      visible: true,
      type: "description",
      value: `${proj.name}\n${proj.description}`,
    } as Item));
    sections.push({
      id: makeId(),
      title: "Projects",
      visible: true,
      content: { layout: "list", items },
    });
  }

  if (aiOutput.education && aiOutput.education.length > 0) {
    const items: Item[] = aiOutput.education.map((edu) => ({
      id: makeId(),
      visible: true,
      type: "description",
      value: `${edu.degree} - ${edu.institution} (${edu.year})`,
    } as Item));
    sections.push({
      id: makeId(),
      title: "Education",
      visible: true,
      content: { layout: "list", items },
    });
  }

  if (aiOutput.skills && aiOutput.skills.length > 0) {
    const items: Item[] = [{
      id: makeId(),
      visible: true,
      type: "tags",
      value: { name: "Skills", items: aiOutput.skills, display: "pill" },
    } as Item];
    sections.push({
      id: makeId(),
      title: "Skills",
      visible: true,
      content: { layout: "grid", items },
    });
  }

  return sections;
}

export interface OnboardingPayload {
  fullName: string;
  jobTitle: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  locale?: string;
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  noExperience: boolean;
  projectDescription: string;
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year: string;
  }>;
  keySkills: string;
  skipAi?: boolean;
}

export async function createOnboardingResume(payload: OnboardingPayload): Promise<{ editorId?: string; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "auth" };
  }

  const { fullName, jobTitle, industry, email, phone, location, linkedin, website, locale = "en", skipAi } = payload;

  if (!fullName) {
    return { error: "missingName" };
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
    return { error: "limitCheckFailed" };
  }

  if (count !== null && count >= maxResumes) {
    return { error: isPremium ? "limitPro" : "limitFree" };
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

  let sections: Array<{
    id: string;
    title: string;
    visible: boolean;
    content: { layout: string; items: Item[] };
  }> = [];

  if (!skipAi) {
    const aiInput: ResumeInput = {
      fullName,
      jobTitle,
      industry,
      experience: payload.experience || [],
      noExperience: payload.noExperience || false,
      projectDescription: payload.projectDescription || "",
      education: payload.education || [],
      keySkills: payload.keySkills || "",
    };

    const aiOutput = await generateResume(aiInput, locale);
    if (!aiOutput) return { error: "aiErrorGenerateResume" };
    sections = buildSections(aiOutput, aiInput);
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
    return { error: "dbError" };
  }

  return { editorId: data.id };
}
