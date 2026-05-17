import type { TemplateConfig } from "@/types/template";
import { modernTemplate } from "./modern";
import { classicTemplate } from "./classic";

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
