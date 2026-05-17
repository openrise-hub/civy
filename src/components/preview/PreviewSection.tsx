"use client";

import { Section } from "@/types/resume";
import { ColorScheme } from "@/components/pdf/engine/PdfStyles";
import { PreviewItem } from "./PreviewItem";

interface PreviewSectionProps {
  section: Section;
  colors: ColorScheme;
  isDimmed?: boolean;
}

export function PreviewSection({ section, colors, isDimmed }: PreviewSectionProps) {
  if (!section.visible) return null;

  const { layout, columns = 1, items } = section.content;

  const getContentStyle = (): React.CSSProperties => {
    if (layout === "grid") {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '8px',
      };
    }
    if (layout === "inline") {
      return {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      };
    }
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    };
  };

  return (
    <section style={{ marginBottom: '16px', opacity: isDimmed ? 0.35 : 1, transition: 'opacity 0.2s ease' }}>
      <h2 style={{
        fontSize: '10pt',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        borderBottom: `2px solid ${colors.accents?.[0] || colors.text}`,
        paddingBottom: '4px',
        margin: '0 0 12px 0',
        color: colors.accents?.[0] || colors.text,
      }}>
        {section.title.toUpperCase()}
      </h2>

      <div style={getContentStyle()}>
        {items.map((item) => (
          <div key={item.id} style={layout === "grid" && item.type === "tags" ? { gridColumn: '1 / -1' } : undefined}>
            <PreviewItem item={item} colors={colors} />
          </div>
        ))}
      </div>
    </section>
  );
}
