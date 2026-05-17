"use client";

import { Item, StringItem, DateRangeItem, LinkItem, RatingItem, TagsItem } from "@/types/resume";
import type { TemplateConfig } from "@/types/template";
import { useTranslations } from "next-intl";
import React from "react";
import {
  isStringItem,
  isDateRangeItem,
  isLinkItem,
  isRatingItem,
  isSeparatorItem,
  formatDateRange,
} from "@/lib/resume-helpers";

interface PreviewItemProps {
  item: Item;
  config: TemplateConfig;
}

function DescriptionPreview({ text, config }: { text: string; config: TemplateConfig }) {
  const { colors, typography } = config;
  const baseStyle: React.CSSProperties = {
    color: colors.body,
    margin: 0,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineSpacing,
  };
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    const style = { ...baseStyle, paddingLeft: "20px", margin: "2px 0" };
    elements.push(
      React.createElement(
        listType === "bullet" ? "ul" : "ol",
        { key: elements.length, style },
        ...listItems
      )
    );
    listItems = [];
    listType = null;
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^- (.*)/);
    const numberMatch = line.match(/^(\d+)\. (.*)/);

    if (bulletMatch) {
      if (listType !== "bullet") { flushList(); listType = "bullet"; }
      listItems.push(
        React.createElement("li", {
          key: listItems.length,
          style: { ...baseStyle, margin: "1px 0" },
        }, bulletMatch[1])
      );
    } else if (numberMatch) {
      if (listType !== "number") { flushList(); listType = "number"; }
      listItems.push(
        React.createElement("li", {
          key: listItems.length,
          style: { ...baseStyle, margin: "1px 0" },
        }, numberMatch[2])
      );
    } else {
      flushList();
      if (line.trim()) {
        elements.push(
          React.createElement("p", { key: elements.length, style: baseStyle }, line)
        );
      }
    }
  }
  flushList();

  return React.createElement(React.Fragment, null, ...elements);
}

function TagsPreview({ item, config }: { item: TagsItem; config: TemplateConfig }) {
  const { colors } = config;
  const { name, items: tagItems, display } = item.value;
  const bgColor = "#e5e7eb";
  const accentColor = colors.sectionTitles || "#2563eb";

  const tagStyleBase = (): React.CSSProperties => {
    switch (display) {
      case "badge":
        return { display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "9pt", backgroundColor: bgColor, color: colors.body };
      case "pill":
        return { display: "inline-block", padding: "2px 8px", borderRadius: "9999px", fontSize: "9pt", backgroundColor: bgColor, color: colors.body };
      case "outline":
        return { display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "9pt", border: `1px solid ${accentColor}`, color: accentColor };
      case "soft":
        return { display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "9pt", backgroundColor: `${accentColor}18`, color: accentColor };
      case "dot":
        return { fontSize: "10pt", color: colors.body };
      case "compact":
        return { display: "inline-block", padding: "1px 4px", fontSize: "8pt", color: colors.body };
      case "block":
        return { display: "block", padding: "2px 8px", fontSize: "9pt", backgroundColor: bgColor, color: colors.body, marginBottom: "2px", borderRadius: "4px" };
      case "sep":
        return { fontSize: "11pt", color: colors.body };
      default:
        return { fontSize: "11pt", color: colors.body };
    }
  };

  const nameStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: "10pt",
    margin: "0 0 4px 0",
    color: colors.body,
  };

  if (display === "sep") {
    return (
      <div style={{ marginBottom: "4px", width: "100%" }}>
        {name && <p style={nameStyle}>{name}</p>}
        <span style={{ fontSize: "11pt", color: colors.body }}>{tagItems.join(" • ")}</span>
      </div>
    );
  }

  if (display === "dot") {
    return (
      <div style={{ marginBottom: "4px", width: "100%" }}>
        {name && <p style={nameStyle}>{name}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {tagItems.map((tag, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10pt", color: colors.body }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accentColor, display: "inline-block", flexShrink: 0 }} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (display === "block") {
    return (
      <div style={{ marginBottom: "4px", width: "100%" }}>
        {name && <p style={nameStyle}>{name}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {tagItems.map((tag, i) => (
            <span key={i} style={tagStyleBase()}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (display === "text" || display === "compact") {
    return (
      <div style={{ marginBottom: "4px", width: "100%" }}>
        {name && <p style={nameStyle}>{name}</p>}
        {display === "text" ? (
          <span style={tagStyleBase()}>{tagItems.join(", ")}</span>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
            {tagItems.map((tag, i) => (
              <span key={i} style={tagStyleBase()}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "4px", width: "100%" }}>
      {name && <p style={nameStyle}>{name}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {tagItems.map((tag, i) => (
          <span key={i} style={tagStyleBase()}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export function PreviewItem({ item, config }: PreviewItemProps) {
  const t = useTranslations("resume");
  const { colors } = config;

  if (!item.visible) return null;

  if (isStringItem(item)) return <StringItemPreview item={item} config={config} />;
  if (isDateRangeItem(item)) return <DateRangePreview item={item} config={config} t={t} />;
  if (isLinkItem(item)) return <LinkPreview item={item} config={config} />;
  if (isRatingItem(item)) return <RatingPreview item={item} config={config} />;
  if (isSeparatorItem(item))
    return <hr style={{ border: "none", borderTop: `1px solid #d1d5db`, margin: "8px 0" }} />;
  if (item.type === "tags") return <TagsPreview item={item as TagsItem} config={config} />;

  return null;
}

function StringItemPreview({ item, config }: { item: StringItem; config: TemplateConfig }) {
  const { colors, typography } = config;

  switch (item.type) {
    case "heading":
      return (
        <h3 style={{
          color: colors.name,
          fontSize: typography.fontSize.name,
          fontWeight: typography.bold.name ? 600 : 400,
          margin: 0,
          fontFamily: typography.fontFamily.name,
        }}>
          {item.value}
        </h3>
      );

    case "sub-heading":
      return (
        <h4 style={{
          color: colors.headline,
          fontSize: typography.fontSize.headline,
          fontWeight: typography.bold.headline ? 600 : 400,
          margin: 0,
          fontFamily: typography.fontFamily.headline,
        }}>
          {item.value}
        </h4>
      );

    case "description":
      return <DescriptionPreview text={item.value} config={config} />;

    case "location":
      return (
        <span style={{
          color: colors.connections,
          fontSize: typography.fontSize.connections,
          fontFamily: typography.fontFamily.connections,
        }}>
          📍{item.value}
        </span>
      );

    case "phone":
      return (
        <span style={{
          color: colors.connections,
          fontSize: typography.fontSize.connections,
          fontFamily: typography.fontFamily.connections,
        }}>
          📱{item.value}
        </span>
      );

    case "email":
      return (
        <span style={{
          color: colors.connections,
          fontSize: typography.fontSize.connections,
          fontFamily: typography.fontFamily.connections,
        }}>
          📧{item.value}
        </span>
      );

    default:
      return <span style={{ color: colors.body }}>{item.value}</span>;
  }
}

function DateRangePreview({
  item,
  config,
  t,
}: {
  item: DateRangeItem;
  config: TemplateConfig;
  t: (key: string) => string;
}) {
  const formatted = formatDateRange(item.value, t);
  return (
    <span style={{
      fontStyle: "italic",
      color: config.colors.connections,
      fontSize: config.typography.fontSize.connections,
    }}>
      {formatted}
    </span>
  );
}

function LinkPreview({ item, config }: { item: LinkItem; config: TemplateConfig }) {
  return (
    <a
      href={item.value.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: config.colors.links,
        textDecoration: config.links.underline ? "underline" : "none",
      }}
    >
      {item.value.label || item.value.url}
    </a>
  );
}

function RatingPreview({ item, config }: { item: RatingItem; config: TemplateConfig }) {
  const { label, score, max, display } = item.value;
  const accent = config.colors.sectionTitles || "#2563eb";

  const renderDisplay = () => {
    switch (display) {
      case "stars":
        return (
          <span style={{ color: accent }}>
            {"★".repeat(score)}{"☆".repeat(max - score)}
          </span>
        );

      case "dots":
        return (
          <div style={{ display: "flex", gap: "4px" }}>
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: i < score ? accent : "#e5e7eb",
                }}
              />
            ))}
          </div>
        );

      case "bar":
        return (
          <div style={{
            flex: 1,
            maxWidth: "100px",
            height: "6px",
            background: "#e5e7eb",
            borderRadius: "3px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${(score / max) * 100}%`,
              height: "100%",
              backgroundColor: accent,
              borderRadius: "3px",
            }} />
          </div>
        );

      default:
        return <span>{score}/{max}</span>;
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: config.typography.fontSize.body,
      color: config.colors.body,
    }}>
      <span style={{ flexShrink: 0, minWidth: "80px" }}>{label}</span>
      {renderDisplay()}
    </div>
  );
}
