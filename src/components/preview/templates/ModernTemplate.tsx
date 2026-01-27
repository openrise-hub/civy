"use client";

import type { Resume, Section } from "@/types/resume";
import { SectionItem, type ItemColors } from "@/components/editor/SectionItem";
import { SectionList } from "@/components/editor/SectionList";

interface ModernTemplateProps {
  resume: Resume;
}

/**
 * ModernSection - Template-specific section wrapper
 * Uses SectionList for layout, adds Modern-style section headers
 */
function ModernSection({
  section,
  colors,
}: {
  section: Section;
  colors: ItemColors;
}) {
  if (!section.visible) return null;

  return (
    <div className="mb-6">
      <h2
        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1 border-b-2"
        style={{
          color: colors.primary,
          borderColor: colors.primary,
        }}
      >
        {section.title}
      </h2>

      <SectionList content={section.content} colors={colors} />
    </div>
  );
}

/**
 * ModernTemplate - Clean, professional resume template
 * 
 * Design: Centered header, uppercase section titles with accent border,
 * relaxed spacing, sans-serif typography.
 */
export function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personal, sections, metadata } = resume;
  const { colors: colorScheme } = metadata;

  const colors: ItemColors = {
    text: colorScheme.text,
    primary: colorScheme.accents[0] ?? "#2563eb",
    secondary: colorScheme.accents[1] ?? "#3b82f6",
    muted: colorScheme.accents[3] ?? "#6b7280",
  };

  return (
    <div
      className="w-full h-full p-8 font-sans"
      style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}
    >
      {/* Header */}
      <header className="mb-8 text-center">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: colors.primary }}
        >
          {personal.fullName}
        </h1>
        {personal.jobTitle && (
          <p className="text-lg" style={{ color: colors.secondary }}>
            {personal.jobTitle}
          </p>
        )}

        {/* Contact Details */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {personal.details.map((item) => (
            <SectionItem key={item.id} item={item} colors={colors} />
          ))}
        </div>
      </header>

      {/* Sections */}
      <main>
        {sections.map((section) => (
          <ModernSection key={section.id} section={section} colors={colors} />
        ))}
      </main>
    </div>
  );
}
