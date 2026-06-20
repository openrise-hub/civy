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
  industries: string[];
  config: TemplateConfig;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  modern: {
    name: "Modern",
    description: "Clean, professional design with blue accents and partial-line section titles.",
    industries: ["Technology", "Finance", "Consulting", "Healthcare", "Banking", "Insurance", "RealEstate"],
    config: modernTemplate,
  },
  classic: {
    name: "Classic",
    description: "Traditional ATS-friendly layout with navy accents, justified text, and date-right alignment.",
    industries: ["Legal", "Finance", "Government", "Corporate", "Banking", "Accounting", "HumanResources"],
    config: classicTemplate,
  },
  minimal: {
    name: "Minimal",
    description: "Black text, no section lines, left-aligned header. Maximum content density for tech and engineering roles.",
    industries: ["Technology", "Engineering", "Startups", "Design", "SaaS", "Telecommunications", "Ecommerce"],
    config: minimalTemplate,
  },
  professional: {
    name: "Professional",
    description: "Navy accents with full-width section borders and justified text. Ideal for business, finance, and law.",
    industries: ["Consulting", "Management", "Sales", "Business", "Operations", "Marketing", "HumanResources"],
    config: professionalTemplate,
  },
  creative: {
    name: "Creative",
    description: "Teal accents, centered section titles with side lines, small-caps name, and diamond bullet points.",
    industries: ["Design", "Marketing", "Media", "CreativeArts", "Entertainment", "Advertising", "Fashion"],
    config: creativeTemplate,
  },
  executive: {
    name: "Executive",
    description: "Large 30pt name, wide margins, generous spacing, and centered section titles. Built for senior leadership.",
    industries: ["Executive", "Management", "Leadership", "CorporateGovernance", "Nonprofit", "BoardOfDirectors"],
    config: executiveTemplate,
  },
  academic: {
    name: "Academic",
    description: "Compact 9pt body, US Letter, tight spacing, small-caps section titles, and page-numbered footer. High-density for CVs.",
    industries: ["Academia", "Research", "Science", "Education", "Healthcare", "Pharmaceuticals", "Biotech"],
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

export function getAllIndustries(): string[] {
  const set = new Set<string>();
  for (const entry of Object.values(templateRegistry)) {
    for (const ind of entry.industries) {
      set.add(ind);
    }
  }
  return Array.from(set).sort();
}
