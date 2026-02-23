// Resume content limits

export const RESUME_LIMITS = {
  // Structure limits
  MAX_SECTIONS: 20,
  MAX_ITEMS_PER_SECTION: 50,
  MAX_PERSONAL_DETAILS: 10,

  // Character limits
  MAX_FULL_NAME: 100,
  MAX_JOB_TITLE: 100,
  MAX_SECTION_TITLE: 300,
  MAX_TEXT_FIELD: 3000,
  MAX_TOTAL_CONTENT: 30000,

  // Tier limits
  FREE_MAX_RESUMES: 1,
  PRO_MAX_RESUMES: 50,
  FREE_MAX_FOLDERS: 1,
  PRO_MAX_FOLDERS: 25,

  // Rate limiting (ms)
  MIN_SAVE_INTERVAL_MS: 2000,
} as const;

// Template tiers
export const FREE_TEMPLATES = ['modern'] as const;
export const PRO_TEMPLATES = [] as const;
export const ALL_TEMPLATES = [...FREE_TEMPLATES, ...PRO_TEMPLATES] as const;

export type FreeTemplate = (typeof FREE_TEMPLATES)[number];
export type ProTemplate = (typeof PRO_TEMPLATES)[number];
export type Template = (typeof ALL_TEMPLATES)[number];
