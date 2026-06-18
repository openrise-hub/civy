"use client";

import { PersonalInfo } from "@/types/resume";
import type { TemplateConfig } from "@/types/template";
import { PreviewItem } from "./PreviewItem";

function toCssFontSize(value: string): string {
  const num = parseFloat(value);
  if (value.endsWith("pt")) return `${num}px`;
  if (value.endsWith("em")) return value;
  return value;
}

interface PreviewHeaderProps {
  personal: PersonalInfo;
  config: TemplateConfig;
}

export function PreviewHeader({ personal, config }: PreviewHeaderProps) {
  const { colors, typography, header } = config;
  const alignment = header.alignment === "center"
    ? "center"
    : header.alignment === "right"
      ? "right"
      : "left";

  return (
    <header style={{
      textAlign: alignment as React.CSSProperties['textAlign'],
      marginBottom: header.spaceBelowConnections,
    }}>
      <h1 style={{
        fontSize: toCssFontSize(typography.fontSize.name),
        fontWeight: typography.bold.name ? 700 : 400,
        fontFamily: typography.fontFamily.name,
        margin: `0 0 ${header.spaceBelowName} 0`,
        letterSpacing: "-0.02em",
        color: colors.name,
        fontVariant: typography.smallCaps.name ? "small-caps" : "normal",
      }}>
        {personal.fullName}
      </h1>

      {personal.jobTitle && (
        <p style={{
          fontSize: toCssFontSize(typography.fontSize.headline),
          fontWeight: typography.bold.headline ? 700 : 400,
          fontFamily: typography.fontFamily.headline,
          margin: `0 0 ${header.spaceBelowHeadline} 0`,
          color: colors.headline,
          fontVariant: typography.smallCaps.headline ? "small-caps" : "normal",
        }}>
          {personal.jobTitle}
        </p>
      )}

      {personal.details.length > 0 && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: header.alignment === "center" ? "center" : "flex-start",
          gap: `${header.connections.spaceBetweenConnections}`,
          fontSize: toCssFontSize(typography.fontSize.connections),
          fontFamily: typography.fontFamily.connections,
          color: colors.connections,
        }}>
          {personal.details
            .filter((item) => item.visible !== false)
            .map((item, idx) => (
              <span key={item.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <PreviewItem item={item} config={config} />
                {header.connections.separator && idx < personal.details.length - 1 && (
                  <span style={{ color: colors.connections }}>
                    {header.connections.separator}
                  </span>
                )}
              </span>
            ))}
        </div>
      )}
    </header>
  );
}
