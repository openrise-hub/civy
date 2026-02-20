/**
 * Zod schemas for server-side resume data validation.
 *
 * Mirrors the TypeScript types in @/types/resume.ts
 * The content limits are taken from from @/constants/limits.ts.
 */

import { z } from "zod";
import { RESUME_LIMITS } from "@/constants/limits";
import { ALL_TEMPLATES } from "@/constants/limits";

// Cast readonly tuple for z.enum compatibility
const templateValues = ALL_TEMPLATES as unknown as [string, ...string[]];

// --- Max payload size ---
const MAX_JSONB_BYTES = 153_600;

// --- Item Schemas (Discriminated Union on 'type') ---

const itemMetadataSchema = z
  .object({
    color: z.string().max(20).optional(),
    align: z.enum(["left", "center", "right"]).optional(),
    colSpan: z.number().int().min(1).max(12).optional(),
  })
  .optional();

const stringItemTypes = [
  "heading",
  "sub-heading",
  "text",
  "bullet",
  "number",
  "date",
  "location",
  "phone",
  "email",
  "tag",
] as const;

const stringItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.enum(stringItemTypes),
  metadata: itemMetadataSchema,
  value: z.string().max(RESUME_LIMITS.MAX_TEXT_FIELD),
});

const dateRangeItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("date-range"),
  metadata: itemMetadataSchema,
  value: z.object({
    startDate: z.string().max(20),
    endDate: z.string().max(20).optional(),
    format: z.string().max(20).optional(),
  }),
});

const linkItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("link"),
  metadata: itemMetadataSchema,
  value: z.object({
    label: z.string().max(RESUME_LIMITS.MAX_TEXT_FIELD),
    url: z.string().max(2048),
  }),
});

const socialItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("social"),
  metadata: itemMetadataSchema,
  value: z.object({
    label: z.string().max(RESUME_LIMITS.MAX_TEXT_FIELD),
    url: z.string().max(2048),
  }),
});

const ratingItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("rating"),
  metadata: itemMetadataSchema,
  value: z.object({
    label: z.string().max(RESUME_LIMITS.MAX_TEXT_FIELD),
    score: z.number().min(0).max(10),
    max: z.number().min(1).max(10),
    display: z.enum(["stars", "bar", "dots"]),
  }),
});

const imageItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("image"),
  metadata: itemMetadataSchema,
  value: z.object({
    url: z.string().max(2048),
    alt: z.string().max(200).optional(),
    shape: z.enum(["circle", "square"]).optional(),
  }),
});

const separatorItemSchema = z.object({
  id: z.string().min(1).max(50),
  visible: z.boolean(),
  type: z.literal("separator"),
  metadata: itemMetadataSchema,
  value: z.null(),
});

const itemSchema = z.discriminatedUnion("type", [
  stringItemSchema,
  dateRangeItemSchema,
  linkItemSchema,
  socialItemSchema,
  ratingItemSchema,
  imageItemSchema,
  separatorItemSchema,
]);

// --- Section Schema ---

const sectionContentSchema = z.object({
  id: z.string().min(1).max(50),
  layout: z.enum(["list", "grid", "inline"]),
  columns: z.number().int().min(1).max(4).optional(),
  items: z.array(itemSchema).max(RESUME_LIMITS.MAX_ITEMS_PER_SECTION),
});

const sectionSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().max(RESUME_LIMITS.MAX_SECTION_TITLE),
  visible: z.boolean(),
  content: sectionContentSchema,
});

// --- Personal Info Schema ---

const personalInfoSchema = z.object({
  fullName: z.string().max(RESUME_LIMITS.MAX_FULL_NAME),
  jobTitle: z.string().max(RESUME_LIMITS.MAX_JOB_TITLE).optional(),
  avatar: z.string().max(2048).optional(),
  details: z.array(itemSchema).max(RESUME_LIMITS.MAX_PERSONAL_DETAILS),
});

// --- Metadata Schema ---

const metadataSchema = z.object({
  template: z.enum(templateValues),
  typography: z.object({
    fontFamily: z.string().max(50),
    fontSize: z.enum(["sm", "md", "lg"]),
  }),
  colors: z.object({
    background: z.string().max(20),
    text: z.string().max(20),
    accents: z.array(z.string().max(20)).max(10),
  }),
});

// --- Resume Data Schema (the JSONB column) ---

export const resumeDataSchema = z
  .object({
    metadata: metadataSchema,
    personal: personalInfoSchema,
    sections: z.array(sectionSchema).max(RESUME_LIMITS.MAX_SECTIONS),
  })
  .refine(
    (data) => JSON.stringify(data).length <= MAX_JSONB_BYTES,
    { message: `Resume data exceeds ${MAX_JSONB_BYTES} byte limit` }
  );

// --- Schema for saveResume updates ---

export const saveResumeUpdatesSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(RESUME_LIMITS.MAX_SECTION_TITLE, "Title is too long")
      .optional(),
    data: resumeDataSchema.optional(),
  })
  .refine(
    (u) => u.title !== undefined || u.data !== undefined,
    { message: "At least one of title or data must be provided" }
  );

export type SaveResumeUpdates = z.infer<typeof saveResumeUpdatesSchema>;
