"use client";

import { Resume } from "@/types/resume";
import { ColorScheme } from "@/components/pdf/engine/PdfStyles";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewSection } from "./PreviewSection";

interface ResumePreviewProps {
  resume: Resume;
  activeSectionId?: string | null;
}

/**
 * HTML/CSS Resume Preview
 * 
 * This component renders inside a container with `flex-1 overflow-hidden relative`.
 * The outer ScrollArea handles scrolling. The A4 "page" is centered with margin auto.
 */
export function ResumePreview({ resume, activeSectionId }: ResumePreviewProps) {
  const colors: ColorScheme = {
    ...resume.metadata.colors,
    accents: resume.metadata.colors.accents as string[],
  };

  return (
    <div
      style={{
        // A4 dimensions at 72dpi: 595 x 842
        // But we want it to fit within the container and be scrollable
        width: '595px',
        minHeight: '842px',
        padding: '40px 48px',
        margin: '16px auto', // Center horizontally with some vertical margin
        backgroundColor: colors.background || '#ffffff',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        fontSize: '11pt',
        lineHeight: 1.5,
        color: colors.text || '#1f2937',
        boxSizing: 'border-box',
      }}
    >
      <PreviewHeader personal={resume.personal} colors={colors} />

      {resume.sections.map((section) => (
        <PreviewSection key={section.id} section={section} colors={colors} isDimmed={!!activeSectionId && activeSectionId !== section.id} />
      ))}
    </div>
  );
}
