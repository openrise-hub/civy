"use client";

import { Resume } from "@/types/resume";
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

export function ResumePreview({ resume, activeSectionId }: ResumePreviewProps) {
  const config = getTemplateConfig(resume);
  const { colors, page, typography } = config;

  const pageSizes: Record<string, { w: number; h: number }> = {
    "a4": { w: 595, h: 842 },
    "us-letter": { w: 612, h: 792 },
  };
  const pageDims = pageSizes[page.size] || pageSizes.a4;

  return (
    <div
      style={{
        width: `${pageDims.w}px`,
        minHeight: `${pageDims.h}px`,
        paddingTop: page.topMargin,
        paddingBottom: page.bottomMargin,
        paddingLeft: page.leftMargin,
        paddingRight: page.rightMargin,
        margin: "16px auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.body,
        lineHeight: typography.lineSpacing,
        color: colors.body,
        boxSizing: "border-box",
        textAlign: typography.alignment === "justified" ? "justify" : typography.alignment,
      }}
    >
      {page.showTopNote && (
        <div style={{
          fontSize: typography.fontSize.connections,
          color: colors.topNote,
          marginBottom: 12,
          fontFamily: typography.fontFamily.connections,
        }}>
          Last updated {new Date().toLocaleDateString()}
        </div>
      )}

      <PreviewHeader personal={resume.personal} config={config} />

      {resume.sections.map((section) => (
        <PreviewSection
          key={section.id}
          section={section}
          config={config}
          isDimmed={!!activeSectionId && activeSectionId !== section.id}
        />
      ))}

      {page.showFooter && (
        <div style={{
          textAlign: "center",
          fontSize: typography.fontSize.connections,
          color: colors.footer,
          fontFamily: typography.fontFamily.connections,
          marginTop: 24,
        }}>
          {resume.personal.fullName} — 1 / 1
        </div>
      )}
    </div>
  );
}
