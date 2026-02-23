"use client";

import { Item, StringItem, DateRangeItem, LinkItem, RatingItem } from "@/types/resume";
import { ColorScheme } from "@/components/pdf/engine/PdfStyles";
import { useTranslations } from "next-intl";
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

export function PreviewItem({ item, colors }: PreviewItemProps) {
  const t = useTranslations("resume");

  if (!item.visible) return null;

  if (isStringItem(item)) return <StringItemPreview item={item} colors={colors} />;
  if (isDateRangeItem(item)) return <DateRangePreview item={item} colors={colors} t={t} />;
  if (isLinkItem(item)) return <LinkPreview item={item} colors={colors} />;
  if (isRatingItem(item)) return <RatingPreview item={item} colors={colors} />;
  if (isSeparatorItem(item)) return <hr style={{ border: 'none', borderTop: `1px solid ${colors.accents?.[2] || '#e5e7eb'}`, margin: '8px 0' }} />;

  return null;
}

function StringItemPreview({ item, colors }: { item: StringItem; colors: ColorScheme }) {
  const baseStyle = { color: colors.text, margin: 0 };

  switch (item.type) {
    case "heading":
      return <h3 style={{ ...baseStyle, fontSize: '14pt', fontWeight: 600 }}>{item.value}</h3>;

    case "sub-heading":
      return <h4 style={{ ...baseStyle, fontSize: '12pt', fontWeight: 500, color: colors.accents?.[1] || colors.text }}>{item.value}</h4>;

    case "text":
      return <p style={{ ...baseStyle, fontSize: '11pt' }}>{item.value}</p>;

    case "bullet":
      return (
        <div style={{ display: 'flex', gap: '8px', fontSize: '11pt' }}>
          <span style={{ color: colors.accents?.[0] || colors.text, flexShrink: 0 }}>•</span>
          <span style={baseStyle}>{item.value}</span>
        </div>
      );

    case "date":
      return <span style={{ ...baseStyle, fontStyle: 'italic', color: colors.accents?.[3] || colors.text }}>{item.value}</span>;

    case "location":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📍{item.value}</span>;

    case "phone":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📱{item.value}</span>;

    case "email":
      return <span style={{ color: colors.accents?.[3] || colors.text, fontSize: '10pt' }}>📧{item.value}</span>;

    case "tag":
      return (
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '9pt',
          backgroundColor: colors.accents?.[2] || '#e5e7eb',
          color: colors.text,
        }}>
          {item.value}
        </span>
      );

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
