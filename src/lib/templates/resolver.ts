import type { TemplateConfig } from "@/types/template";
import { getTemplateConfig } from "./registry";

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function deepMerge(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };

  for (const key of Object.keys(overrides)) {
    const baseVal = result[key];
    const overrideVal = overrides[key];

    if (isObject(baseVal) && isObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else {
      result[key] = overrideVal;
    }
  }

  return result;
}

export function resolveTemplateConfig(
  templateName: string,
  userOverrides?: Partial<TemplateConfig>
): TemplateConfig {
  const base = getTemplateConfig(templateName);
  if (!userOverrides) return base;

  return deepMerge(
    base as unknown as Record<string, unknown>,
    userOverrides as unknown as Record<string, unknown>
  ) as unknown as TemplateConfig;
}
