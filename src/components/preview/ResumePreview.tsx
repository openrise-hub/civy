"use client";

import { Resume, Section } from "@/types/resume";
import type { TemplateConfig } from "@/types/template";
import { resolveTemplateConfig } from "@/lib/templates/resolver";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewSection } from "./PreviewSection";

interface ResumePreviewProps {
  resume: Resume;
  activeSectionId?: string | null;
}

function getTemplateConfig(resume: Resume): TemplateConfig {
  if (resume.metadata.templateConfig) {
    return resolveTemplateConfig(
      resume.metadata.template || "modern",
      resume.metadata.templateConfig
    );
  }

  return resolveTemplateConfig(resume.metadata.template || "modern");
}

function replacePlaceholders(template: string, values: Record<string, string>): string {
  return template.replace(/\b([A-Z_]+)\b/g, (match) => values[match] || match);
}

function parseLineSpacing(val: string): string {
  const num = parseFloat(val);
  if (val.endsWith("em") || val.endsWith("pt")) return String(1 + num);
  return val;
}

function splitSectionsIntoPages(
  sections: Section[],
  perPage: number
): Section[][] {
  const pages: Section[][] = [];
  for (let i = 0; i < sections.length; i += perPage) {
    pages.push(sections.slice(i, i + perPage));
  }
  return pages.length > 0 ? pages : [[]];
}

export function ResumePreview({ resume, activeSectionId }: ResumePreviewProps) {
  const config = getTemplateConfig(resume);
  const { colors, page, typography, templates: tmpl } = config;
  const showFooter = resume.metadata.showFooter ?? config.page.showFooter;
  const showTopNote = resume.metadata.showTopNote ?? config.page.showTopNote;

  const pageSizes: Record<string, { w: number; h: number }> = {
    "a4": { w: 595, h: 842 },
    "us-letter": { w: 612, h: 792 },
  };
  const pageDims = pageSizes[page.size] || pageSizes.a4;

  const today = new Date().toLocaleDateString();
  const name = resume.personal.fullName;

  const topNoteText = replacePlaceholders(tmpl.topNote, { NAME: name, CURRENT_DATE: today });
  const footerText = replacePlaceholders(tmpl.footer, { NAME: name, PAGE_NUMBER: "1", TOTAL_PAGES: "1", CURRENT_DATE: today });

  const visibleSections = resume.sections.filter((s) => s.visible !== false);
  const sectionsPerPage = config.sections.allowPageBreak ? 2 : 3;
  const pages = splitSectionsIntoPages(visibleSections, sectionsPerPage);

  const pageStyle = {
    width: `${pageDims.w}px`,
    height: `${pageDims.h}px`,
    paddingTop: page.topMargin,
    paddingBottom: page.bottomMargin,
    paddingLeft: page.leftMargin,
    paddingRight: page.rightMargin,
    margin: "16px auto 0 auto",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: parseLineSpacing(typography.lineSpacing),
    color: colors.body,
    boxSizing: "border-box" as const,
    textAlign: (typography.alignment === "justified" ? "justify" : typography.alignment) as React.CSSProperties["textAlign"],
    overflow: "hidden" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 16 }}>
      {pages.map((pageSections, pageIdx) => (
        <div key={pageIdx} style={pageStyle}>
          {pageIdx === 0 && showTopNote && (
            <div style={{
              fontSize: typography.fontSize.connections,
              color: colors.topNote,
              marginBottom: 12,
              fontFamily: typography.fontFamily.connections,
            }}>
              {topNoteText}
            </div>
          )}

          {pageIdx === 0 && (
            <PreviewHeader personal={resume.personal} config={config} />
          )}

          {pageSections.map((section) => (
            <PreviewSection
              key={section.id}
              section={section}
              config={config}
              isDimmed={!!activeSectionId && activeSectionId !== section.id}
            />
          ))}

          {showFooter && pageIdx === pages.length - 1 && (
            <div style={{
              textAlign: "center",
              fontSize: typography.fontSize.connections,
              color: colors.footer,
              fontFamily: typography.fontFamily.connections,
              marginTop: 24,
            }}>
              {footerText}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
