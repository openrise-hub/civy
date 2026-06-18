"use client";

import { Section } from "@/types/resume";
import type { TemplateConfig } from "@/types/template";
import { PreviewItem } from "./PreviewItem";

function toCssFontSize(value: string): string {
  const num = parseFloat(value);
  if (value.endsWith("pt")) return `${num}px`;
  if (value.endsWith("em")) return value;
  return value;
}

function cssToPreviewPx(value: string): number {
  const num = parseFloat(value);
  if (value.endsWith("cm")) return num * 28.35;
  if (value.endsWith("in")) return num * 72;
  if (value.endsWith("mm")) return num * 2.835;
  if (value.endsWith("pt")) return num;
  return num;
}

interface PreviewSectionProps {
  section: Section;
  config: TemplateConfig;
  isDimmed?: boolean;
  isFirstOnPage?: boolean;
}

function renderSectionTitle(type: string, title: string, config: TemplateConfig) {
  const { colors, typography, sectionTitles: st } = config;
  const baseTitleStyle: React.CSSProperties = {
    fontSize: toCssFontSize(typography.fontSize.sectionTitles),
    fontWeight: typography.bold.sectionTitles ? 600 : 400,
    fontFamily: typography.fontFamily.sectionTitles,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: colors.sectionTitles,
    margin: `0 0 ${st.spaceBelow} 0`,
  };

  const lineHeight = parseFloat(st.lineThickness) || 1;

  switch (type) {
    case "without_line":
      return (
        <h2 style={{ ...baseTitleStyle, paddingBottom: 0 }}>
          {title.toUpperCase()}
        </h2>
      );

    case "with_full_line":
      return (
        <h2 style={{
          ...baseTitleStyle,
          borderBottom: `${lineHeight}px solid ${colors.sectionTitles}`,
          paddingBottom: 4,
        }}>
          {title.toUpperCase()}
        </h2>
      );

    case "centered_without_line":
      return (
        <h2 style={{ ...baseTitleStyle, textAlign: "center", paddingBottom: 0 }}>
          {title.toUpperCase()}
        </h2>
      );

    case "centered_with_full_line":
      return (
        <h2 style={{
          ...baseTitleStyle,
          textAlign: "center",
          borderBottom: `${lineHeight}px solid ${colors.sectionTitles}`,
          paddingBottom: 4,
        }}>
          {title.toUpperCase()}
        </h2>
      );

    case "centered_with_partial_line":
    case "centered_with_centered_partial_line":
      return (
        <div style={{ textAlign: "center", margin: baseTitleStyle.margin }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: lineHeight, backgroundColor: colors.sectionTitles }} />
            <h2 style={{ ...baseTitleStyle, margin: 0, paddingBottom: 0, borderBottom: "none" }}>
              {title.toUpperCase()}
            </h2>
            <div style={{ flex: 1, height: lineHeight, backgroundColor: colors.sectionTitles }} />
          </div>
        </div>
      );

    case "moderncv":
      return (
        <h2 style={{
          ...baseTitleStyle,
          borderBottom: `${lineHeight}px solid ${colors.sectionTitles}`,
          paddingBottom: 4,
        }}>
          {title.toUpperCase()}
        </h2>
      );

    case "with_partial_line":
    default:
      return (
        <h2 style={{
          ...baseTitleStyle,
          borderBottom: `${lineHeight}px solid ${colors.sectionTitles}`,
          paddingBottom: 4,
        }}>
          {title.toUpperCase()}
        </h2>
      );
  }
}

export function PreviewSection({ section, config, isDimmed, isFirstOnPage }: PreviewSectionProps) {
  if (!section.visible) return null;

  const { layout, columns = 1, items } = section.content;
  const { sections: sects, entries } = config;

  const spacing = layout === "grid" || layout === "inline"
    ? sects.spaceBetweenTextBasedEntries
    : entries.spaceBetweenColumns;

  const getContentStyle = (): React.CSSProperties => {
    if (layout === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing,
      };
    }
    if (layout === "inline") {
      return {
        display: "flex",
        flexWrap: "wrap",
        gap: spacing,
      };
    }
    return {
      display: "flex",
      flexDirection: "column",
      gap: spacing,
    };
  };

  return (
    <section style={{
      paddingBottom: cssToPreviewPx(config.sectionTitles.spaceAbove) + 4,
      opacity: isDimmed ? 0.35 : 1,
      transition: "opacity 0.2s ease",
      pageBreakInside: sects.allowPageBreak ? "auto" : "avoid",
    }}>
      <div style={{ marginTop: isFirstOnPage ? 0 : config.sectionTitles.spaceAbove }}>
        {renderSectionTitle(config.sectionTitles.type, section.title, config)}
      </div>

      <div style={getContentStyle()}>
        {items.map((item) => (
          <div
            key={item.id}
            style={
              layout === "grid" && item.type === "tags"
                ? { gridColumn: "1 / -1" }
                : undefined
            }
          >
            <PreviewItem item={item} config={config} />
          </div>
        ))}
      </div>
    </section>
  );
}
