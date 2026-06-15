import type { TemplateConfig } from "@/types/template";
import { modernTemplate } from "./modern";
import { classicTemplate } from "./classic";
import { minimalTemplate } from "./minimal";
import { professionalTemplate } from "./professional";
import { creativeTemplate } from "./creative";
import { executiveTemplate } from "./executive";
import { academicTemplate } from "./academic";

export interface TemplateEntry {
  name: string;
  description: string;
  config: TemplateConfig;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  modern: {
    name: "Modern",
    description: "Clean, professional design with blue accents and partial-line section titles.",
    config: modernTemplate,
  },
  classic: {
    name: "Classic",
    description: "Traditional ATS-friendly layout with navy accents, justified text, and date-right alignment.",
    config: classicTemplate,
  },
  minimal: {
    name: "Minimal",
    description: "Black text, no section lines, left-aligned header. Maximum content density for tech and engineering roles.",
    config: minimalTemplate,
  },
  professional: {
    name: "Professional",
    description: "Navy accents with full-width section borders and justified text. Ideal for business, finance, and law.",
    config: professionalTemplate,
  },
  creative: {
    name: "Creative",
    description: "Teal accents, centered section titles with side lines, small-caps name, and diamond bullet points.",
    config: creativeTemplate,
  },
  executive: {
    name: "Executive",
    description: "Large 30pt name, wide margins, generous spacing, and centered section titles. Built for senior leadership.",
    config: executiveTemplate,
  },
  academic: {
    name: "Academic",
    description: "Compact 9pt body, US Letter, tight spacing, small-caps section titles, and page-numbered footer. High-density for CVs.",
    config: academicTemplate,
  },
};

export function getTemplateList(): TemplateEntry[] {
  return Object.values(templateRegistry);
}

export function getTemplateConfig(name: string): TemplateConfig {
  const entry = templateRegistry[name];
  if (!entry) {
    throw new Error(`Template "${name}" not found in registry`);
  }
  return entry.config;
}
