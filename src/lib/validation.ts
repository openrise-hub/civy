import type { Resume, Section, Item } from '@/types/resume';
import { RESUME_LIMITS } from '@/constants/limits';
import { isStringItem, isLinkItem, isRatingItem } from './resume-helpers';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// --- Content Counting ---

/**
 * Count the text content of a single item
 */
export function countItemContent(item: Item): number {
  if (isStringItem(item)) {
    return item.value.length;
  }
  if (isLinkItem(item)) {
    return item.value.label.length + item.value.url.length;
  }
  if (isRatingItem(item)) {
    return item.value.label.length;
  }
  // DateRangeItem, ImageItem, SeparatorItem have minimal text
  return 0;
}

/**
 * Count all text content in a section
 */
export function countSectionContent(section: Section): number {
  let total = section.title.length;
  for (const item of section.content.items) {
    total += countItemContent(item);
  }
  return total;
}

/**
 * Count all text content in a resume (for the 30k limit)
 */
export function countTotalContent(resume: Resume): number {
  let total = 0;

  // Personal info
  total += resume.personal.fullName?.length || 0;
  total += resume.personal.jobTitle?.length || 0;
  for (const detail of resume.personal.details) {
    total += countItemContent(detail);
  }

  // Sections
  for (const section of resume.sections) {
    total += countSectionContent(section);
  }

  return total;
}

// --- Validation Checks ---

/**
 * Check if a new section can be added
 */
export function canAddSection(resume: Resume): ValidationResult {
  if (resume.sections.length >= RESUME_LIMITS.MAX_SECTIONS) {
    return {
      valid: false,
      error: `Maximum ${RESUME_LIMITS.MAX_SECTIONS} sections allowed`,
    };
  }
  return { valid: true };
}

/**
 * Check if a new item can be added to a section
 */
export function canAddItem(section: Section): ValidationResult {
  if (section.content.items.length >= RESUME_LIMITS.MAX_ITEMS_PER_SECTION) {
    return {
      valid: false,
      error: `Maximum ${RESUME_LIMITS.MAX_ITEMS_PER_SECTION} items per section`,
    };
  }
  return { valid: true };
}

/**
 * Check if a new personal detail can be added
 */
export function canAddPersonalDetail(resume: Resume): ValidationResult {
  if (resume.personal.details.length >= RESUME_LIMITS.MAX_PERSONAL_DETAILS) {
    return {
      valid: false,
      error: `Maximum ${RESUME_LIMITS.MAX_PERSONAL_DETAILS} contact details`,
    };
  }
  return { valid: true };
}

/**
 * Validate total content doesn't exceed the 30k limit
 */
export function validateTotalContent(resume: Resume): ValidationResult {
  const total = countTotalContent(resume);
  if (total > RESUME_LIMITS.MAX_TOTAL_CONTENT) {
    return {
      valid: false,
      error: `Content exceeds ${RESUME_LIMITS.MAX_TOTAL_CONTENT.toLocaleString()} character limit`,
    };
  }
  return { valid: true };
}

// --- Helper Functions ---

/**
 * Get remaining characters for a field
 */
export function getRemainingChars(current: number, max: number): number {
  return Math.max(0, max - current);
}

/**
 * Get content usage as a percentage (0-100)
 */
export function getContentPercentage(resume: Resume): number {
  const total = countTotalContent(resume);
  return Math.min(100, Math.round((total / RESUME_LIMITS.MAX_TOTAL_CONTENT) * 100));
}

/**
 * Check if content is approaching the limit (>80%)
 */
export function isNearContentLimit(resume: Resume): boolean {
  return getContentPercentage(resume) >= 80;
}

/**
 * Check if a character count is near its limit (>90%)
 */
export function isNearCharLimit(current: number, max: number): boolean {
  return current >= max * 0.9;
}
