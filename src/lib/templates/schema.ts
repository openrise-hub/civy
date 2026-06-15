import { z } from "zod";

// --- Shared literals ---

const pageSizeSchema = z.enum(["a4", "us-letter"]);
const bodyAlignmentSchema = z.enum(["left", "justified"]);
const alignmentSchema = z.enum(["left", "center", "right"]);
const sectionTitleTypeSchema = z.enum([
  "with_partial_line",
  "with_full_line",
  "without_line",
  "moderncv",
  "centered_without_line",
  "centered_with_partial_line",
  "centered_with_centered_partial_line",
  "centered_with_full_line",
]);
const phoneNumberFormatSchema = z.enum(["national", "international", "E164"]);
const bulletCharSchema = z.enum(["●", "•", "◦", "-", "◆", "★", "■", "—", "○"]);

// --- Sub-schemas ---

const pageConfigSchema = z.object({
  size: pageSizeSchema,
  topMargin: z.string(),
  bottomMargin: z.string(),
  leftMargin: z.string(),
  rightMargin: z.string(),
  showFooter: z.boolean(),
  showTopNote: z.boolean(),
});

const colorConfigSchema = z.object({
  body: z.string(),
  name: z.string(),
  headline: z.string(),
  connections: z.string(),
  sectionTitles: z.string(),
  links: z.string(),
  footer: z.string(),
  topNote: z.string(),
});

const fontFamilyConfigSchema = z.object({
  body: z.string(),
  name: z.string(),
  headline: z.string(),
  connections: z.string(),
  sectionTitles: z.string(),
});

const fontSizeConfigSchema = z.object({
  body: z.string(),
  name: z.string(),
  entryHeading: z.string(),
  headline: z.string(),
  connections: z.string(),
  sectionTitles: z.string(),
});

const smallCapsConfigSchema = z.object({
  name: z.boolean(),
  headline: z.boolean(),
  connections: z.boolean(),
  sectionTitles: z.boolean(),
});

const boldConfigSchema = z.object({
  name: z.boolean(),
  entryHeading: z.boolean(),
  headline: z.boolean(),
  connections: z.boolean(),
  sectionTitles: z.boolean(),
});

const typographyConfigSchema = z.object({
  lineSpacing: z.string(),
  alignment: bodyAlignmentSchema,
  dateAndLocationColumnAlignment: alignmentSchema,
  fontFamily: fontFamilyConfigSchema,
  fontSize: fontSizeConfigSchema,
  smallCaps: smallCapsConfigSchema,
  bold: boldConfigSchema,
});

const linksConfigSchema = z.object({
  underline: z.boolean(),
  showExternalLinkIcon: z.boolean(),
});

const connectionsConfigSchema = z.object({
  phoneNumberFormat: phoneNumberFormatSchema,
  hyperlink: z.boolean(),
  showIcons: z.boolean(),
  displayUrlsInsteadOfUsernames: z.boolean(),
  separator: z.string(),
  spaceBetweenConnections: z.string(),
});

const headerConfigSchema = z.object({
  alignment: alignmentSchema,
  photoWidth: z.string(),
  photoPosition: z.enum(["left", "right"]),
  photoSpaceLeft: z.string(),
  photoSpaceRight: z.string(),
  spaceBelowName: z.string(),
  spaceBelowHeadline: z.string(),
  spaceBelowConnections: z.string(),
  connections: connectionsConfigSchema,
});

const sectionTitleConfigSchema = z.object({
  type: sectionTitleTypeSchema,
  lineThickness: z.string(),
  spaceAbove: z.string(),
  spaceBelow: z.string(),
});

const sectionsConfigSchema = z.object({
  allowPageBreak: z.boolean(),
  spaceBetweenRegularEntries: z.string(),
  spaceBetweenTextBasedEntries: z.string(),
  showTimeSpansIn: z.array(z.string()),
});

const summaryConfigSchema = z.object({
  spaceAbove: z.string(),
  spaceLeft: z.string(),
});

const highlightsConfigSchema = z.object({
  bullet: bulletCharSchema,
  nestedBullet: bulletCharSchema,
  spaceLeft: z.string(),
  spaceAbove: z.string(),
  spaceBetweenItems: z.string(),
  spaceBetweenBulletAndText: z.string(),
});

const entriesConfigSchema = z.object({
  dateAndLocationWidth: z.string(),
  sideSpace: z.string(),
  spaceBetweenColumns: z.string(),
  allowPageBreak: z.boolean(),
  shortSecondRow: z.boolean(),
  degreeWidth: z.string(),
  summary: summaryConfigSchema,
  highlights: highlightsConfigSchema,
});

const oneLineEntryTemplateSchema = z.object({
  mainColumn: z.string(),
});

const educationEntryTemplateSchema = z.object({
  mainColumn: z.string(),
  degreeColumn: z.string().nullable(),
  dateAndLocationColumn: z.string(),
});

const normalEntryTemplateSchema = z.object({
  mainColumn: z.string(),
  dateAndLocationColumn: z.string(),
});

const experienceEntryTemplateSchema = z.object({
  mainColumn: z.string(),
  dateAndLocationColumn: z.string(),
});

const publicationEntryTemplateSchema = z.object({
  mainColumn: z.string(),
  dateAndLocationColumn: z.string(),
});

const templateStringsSchema = z.object({
  footer: z.string(),
  topNote: z.string(),
  singleDate: z.string(),
  dateRange: z.string(),
  timeSpan: z.string(),
  oneLineEntry: oneLineEntryTemplateSchema,
  educationEntry: educationEntryTemplateSchema,
  normalEntry: normalEntryTemplateSchema,
  experienceEntry: experienceEntryTemplateSchema,
  publicationEntry: publicationEntryTemplateSchema,
});

export const templateConfigSchema = z.object({
  theme: z.string(),
  page: pageConfigSchema,
  colors: colorConfigSchema,
  typography: typographyConfigSchema,
  links: linksConfigSchema,
  header: headerConfigSchema,
  sectionTitles: sectionTitleConfigSchema,
  sections: sectionsConfigSchema,
  entries: entriesConfigSchema,
  templates: templateStringsSchema,
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
