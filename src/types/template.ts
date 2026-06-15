// TemplateConfig types — mirrors the RenderCV design model
// Single source of truth for both PDF renderer and HTML preview

export type PageSize = "a4" | "us-letter";
export type BodyAlignment = "left" | "justified";
export type Alignment = "left" | "center" | "right";
export type SectionTitleType =
  | "with_partial_line"
  | "with_full_line"
  | "without_line"
  | "moderncv"
  | "centered_without_line"
  | "centered_with_partial_line"
  | "centered_with_centered_partial_line"
  | "centered_with_full_line";
export type PhoneNumberFormat = "national" | "international" | "E164";
export type BulletChar = "●" | "•" | "◦" | "-" | "◆" | "★" | "■" | "—" | "○";

export interface PageConfig {
  size: PageSize;
  topMargin: string;
  bottomMargin: string;
  leftMargin: string;
  rightMargin: string;
  showFooter: boolean;
  showTopNote: boolean;
}

export interface ColorConfig {
  body: string;
  name: string;
  headline: string;
  connections: string;
  sectionTitles: string;
  links: string;
  footer: string;
  topNote: string;
}

export interface FontFamilyConfig {
  body: string;
  name: string;
  headline: string;
  connections: string;
  sectionTitles: string;
}

export interface FontSizeConfig {
  body: string;
  name: string;
  entryHeading: string;
  headline: string;
  connections: string;
  sectionTitles: string;
}

export interface SmallCapsConfig {
  name: boolean;
  headline: boolean;
  connections: boolean;
  sectionTitles: boolean;
}

export interface BoldConfig {
  name: boolean;
  entryHeading: boolean;
  headline: boolean;
  connections: boolean;
  sectionTitles: boolean;
}

export interface TypographyConfig {
  lineSpacing: string;
  alignment: BodyAlignment;
  dateAndLocationColumnAlignment: Alignment;
  fontFamily: FontFamilyConfig;
  fontSize: FontSizeConfig;
  smallCaps: SmallCapsConfig;
  bold: BoldConfig;
}

export interface LinksConfig {
  underline: boolean;
  showExternalLinkIcon: boolean;
}

export interface ConnectionsConfig {
  phoneNumberFormat: PhoneNumberFormat;
  hyperlink: boolean;
  showIcons: boolean;
  displayUrlsInsteadOfUsernames: boolean;
  separator: string;
  spaceBetweenConnections: string;
}

export interface HeaderConfig {
  alignment: Alignment;
  photoWidth: string;
  photoPosition: "left" | "right";
  photoSpaceLeft: string;
  photoSpaceRight: string;
  spaceBelowName: string;
  spaceBelowHeadline: string;
  spaceBelowConnections: string;
  connections: ConnectionsConfig;
}

export interface SectionTitleConfig {
  type: SectionTitleType;
  lineThickness: string;
  spaceAbove: string;
  spaceBelow: string;
}

export interface SectionsConfig {
  allowPageBreak: boolean;
  spaceBetweenRegularEntries: string;
  spaceBetweenTextBasedEntries: string;
  showTimeSpansIn: string[];
}

export interface SummaryConfig {
  spaceAbove: string;
  spaceLeft: string;
}

export interface HighlightsConfig {
  bullet: BulletChar;
  nestedBullet: BulletChar;
  spaceLeft: string;
  spaceAbove: string;
  spaceBetweenItems: string;
  spaceBetweenBulletAndText: string;
}

export interface EntriesConfig {
  dateAndLocationWidth: string;
  sideSpace: string;
  spaceBetweenColumns: string;
  allowPageBreak: boolean;
  shortSecondRow: boolean;
  degreeWidth: string;
  summary: SummaryConfig;
  highlights: HighlightsConfig;
}

export interface OneLineEntryTemplate {
  mainColumn: string;
}

export interface EducationEntryTemplate {
  mainColumn: string;
  degreeColumn: string | null;
  dateAndLocationColumn: string;
}

export interface NormalEntryTemplate {
  mainColumn: string;
  dateAndLocationColumn: string;
}

export interface ExperienceEntryTemplate {
  mainColumn: string;
  dateAndLocationColumn: string;
}

export interface PublicationEntryTemplate {
  mainColumn: string;
  dateAndLocationColumn: string;
}

export interface TemplateStrings {
  footer: string;
  topNote: string;
  singleDate: string;
  dateRange: string;
  timeSpan: string;
  oneLineEntry: OneLineEntryTemplate;
  educationEntry: EducationEntryTemplate;
  normalEntry: NormalEntryTemplate;
  experienceEntry: ExperienceEntryTemplate;
  publicationEntry: PublicationEntryTemplate;
}

export interface TemplateConfig {
  theme: string;
  page: PageConfig;
  colors: ColorConfig;
  typography: TypographyConfig;
  links: LinksConfig;
  header: HeaderConfig;
  sectionTitles: SectionTitleConfig;
  sections: SectionsConfig;
  entries: EntriesConfig;
  templates: TemplateStrings;
}
