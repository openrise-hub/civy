"use client";

import { Item, StringItem, DateRangeItem, LinkItem, RatingItem, TagsItem } from "@/types/resume";
import { ColorScheme } from "@/components/pdf/engine/PdfStyles";
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
  colors: ColorScheme;
}

function DescriptionPreview({ text, colors }: { text: string; colors: ColorScheme }) {
  const baseStyle = { color: colors.text, margin: 0, fontSize: '11pt', lineHeight: 1.5 };
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    const style = { ...baseStyle, paddingLeft: '20px', margin: '2px 0' };
    elements.push(
      React.createElement(listType === "bullet" ? "ul" : "ol", { key: elements.length, style }, ...listItems)
    );
    listItems = [];
    listType = null;
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^- (.*)/);
    const numberMatch = line.match(/^(\d+)\. (.*)/);

    if (bulletMatch) {
      if (listType !== "bullet") { flushList(); listType = "bullet"; }
      listItems.push(React.createElement("li", { key: listItems.length, style: { ...baseStyle, margin: '1px 0' } }, bulletMatch[1]));
    } else if (numberMatch) {
      if (listType !== "number") { flushList(); listType = "number"; }
      listItems.push(React.createElement("li", { key: listItems.length, style: { ...baseStyle, margin: '1px 0' } }, numberMatch[2]));
    } else {
      flushList();
      if (line.trim()) {
        elements.push(React.createElement("p", { key: elements.length, style: baseStyle }, line));
      }
    }
  }
  flushList();

  return React.createElement(React.Fragment, null, ...elements);
}

function TagsPreview({ item, colors }: { item: TagsItem; colors: ColorScheme }) {
  const { name, items: tagItems, display } = item.value;
  const bgColor = colors.accents?.[2] || '#e5e7eb';
  const accentColor = colors.accents?.[0] || '#2563eb';

  const tagStyle = (base: React.CSSProperties = {}): React.CSSProperties => {
    switch (display) {
      case 'badge': return { ...base, display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '9pt', backgroundColor: bgColor, color: colors.text };
      case 'pill': return { ...base, display: 'inline-block', padding: '2px 8px', borderRadius: '9999px', fontSize: '9pt', backgroundColor: bgColor, color: colors.text };
      case 'outline': return { ...base, display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '9pt', border: `1px solid ${accentColor}`, color: accentColor };
      case 'soft': return { ...base, display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '9pt', backgroundColor: `${accentColor}18`, color: accentColor };
      case 'dot': return { ...base, fontSize: '10pt', color: colors.text };
      case 'compact': return { ...base, display: 'inline-block', padding: '1px 4px', fontSize: '8pt', color: colors.text };
      case 'block': return { ...base, display: 'block', padding: '2px 8px', fontSize: '9pt', backgroundColor: bgColor, color: colors.text, marginBottom: '2px', borderRadius: '4px' };
      case 'sep': return { ...base, fontSize: '11pt', color: colors.text };
      default: return { ...base, fontSize: '11pt', color: colors.text };
    }
  };

  if (display === 'sep') {
    return (
      <div style={{ marginBottom: '4px', width: '100%' }}>
        {name && <p style={{ fontWeight: 600, fontSize: '10pt', margin: '0 0 4px 0', color: colors.text }}>{name}</p>}
        <span style={{ fontSize: '11pt', color: colors.text }}>{tagItems.join(' • ')}</span>
      </div>
    );
  }

  if (display === 'dot') {
    return (
      <div style={{ marginBottom: '4px', width: '100%' }}>
        {name && <p style={{ fontWeight: 600, fontSize: '10pt', margin: '0 0 4px 0', color: colors.text }}>{name}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tagItems.map((tag, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10pt', color: colors.text }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor, display: 'inline-block', flexShrink: 0 }} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (display === 'block') {
    return (
      <div style={{ marginBottom: '4px', width: '100%' }}>
        {name && <p style={{ fontWeight: 600, fontSize: '10pt', margin: '0 0 4px 0', color: colors.text }}>{name}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {tagItems.map((tag, i) => (
            <span key={i} style={tagStyle()}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (display === 'text' || display === 'compact') {
    return (
      <div style={{ marginBottom: '4px', width: '100%' }}>
        {name && <p style={{ fontWeight: 600, fontSize: '10pt', margin: '0 0 4px 0', color: colors.text }}>{name}</p>}
        {display === 'text' ? (
          <span style={tagStyle()}>{tagItems.join(', ')}</span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            {tagItems.map((tag, i) => (
              <span key={i} style={tagStyle()}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      {name && <p style={{ fontWeight: 600, fontSize: '10pt', margin: '0 0 4px 0', color: colors.text }}>{name}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {tagItems.map((tag, i) => (
          <span key={i} style={tagStyle()}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export function PreviewItem({ item, colors }: PreviewItemProps) {
  const t = useTranslations("resume");

  if (!item.visible) return null;

  if (isStringItem(item)) return <StringItemPreview item={item} colors={colors} />;
  if (isDateRangeItem(item)) return <DateRangePreview item={item} colors={colors} t={t} />;
  if (isLinkItem(item)) return <LinkPreview item={item} colors={colors} />;
  if (isRatingItem(item)) return <RatingPreview item={item} colors={colors} />;
  if (isSeparatorItem(item)) return <hr style={{ border: 'none', borderTop: `1px solid ${colors.accents?.[2] || '#e5e7eb'}`, margin: '8px 0' }} />;
  if (item.type === "tags") return <TagsPreview item={item as TagsItem} colors={colors} />;

  return null;
}

function StringItemPreview({ item, colors }: { item: StringItem; colors: ColorScheme }) {
  const baseStyle = { color: colors.text, margin: 0 };

  switch (item.type) {
    case "heading":
      return <h3 style={{ ...baseStyle, fontSize: '14pt', fontWeight: 600 }}>{item.value}</h3>;

    case "sub-heading":
      return <h4 style={{ ...baseStyle, fontSize: '12pt', fontWeight: 500, color: colors.accents?.[1] || colors.text }}>{item.value}</h4>;

    case "description":
      return <DescriptionPreview text={item.value} colors={colors} />;

    case "location":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📍{item.value}</span>;

    case "phone":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📱{item.value}</span>;

    case "email":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📧{item.value}</span>;

    default:
      return <span style={baseStyle}>{item.value}</span>;
  }
}

function DateRangePreview({ item, colors, t }: { item: DateRangeItem; colors: ColorScheme; t: (key: string) => string }) {
  const formatted = formatDateRange(item.value, t);

  return <span style={{ fontStyle: 'italic', color: colors.accents?.[3] || colors.text }}>{formatted}</span>;
}

function LinkPreview({ item, colors }: { item: LinkItem; colors: ColorScheme }) {
  return (
    <a
      href={item.value.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: colors.accents?.[1] || '#2563eb', textDecoration: 'underline' }}
    >
      {item.value.label || item.value.url}
    </a>
  );
}

function RatingPreview({ item, colors }: { item: RatingItem; colors: ColorScheme }) {
  const { label, score, max, display } = item.value;

  const renderDisplay = () => {
    switch (display) {
      case "stars":
        return <span style={{ color: colors.accents?.[0] || '#f59e0b' }}>{"★".repeat(score)}{"☆".repeat(max - score)}</span>;

      case "dots":
        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: i < score ? (colors.accents?.[0] || '#3b82f6') : (colors.accents?.[2] || '#e5e7eb'),
                }}
              />
            ))}
          </div>
        );

      case "bar":
        return (
          <div style={{ flex: 1, maxWidth: '100px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${(score / max) * 100}%`, height: '100%', backgroundColor: colors.accents?.[0] || '#3b82f6', borderRadius: '3px' }} />
          </div>
        );

      default:
        return <span>{score}/{max}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11pt' }}>
      <span style={{ flexShrink: 0, minWidth: '80px' }}>{label}</span>
      {renderDisplay()}
    </div>
  );
}
