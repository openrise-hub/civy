"use client";

import type { Item } from "@/types/resume";
import {
  isStringItem,
  isDateRangeItem,
  isLinkItem,
  isRatingItem,
  formatDateRange,
} from "@/lib/resume-helpers";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkIcon,
  StarIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

/**
 * ItemColors - The color palette passed from the template.
 * Each template defines its own color mapping.
 */
export interface ItemColors {
  text: string;
  primary: string;
  secondary: string;
  muted: string;
}

interface SectionItemProps {
  item: Item;
  colors: ItemColors;
}

/**
 * Simple markdown renderer for description-type items.
 * Handles: paragraphs, - bullets, 1. numbered lists, [text](url) links.
 */
function DescriptionBlock({ text, colors }: { text: string; colors: ItemColors }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    const Tag = listType === "bullet" ? "ul" : "ol";
    elements.push(
      React.createElement(Tag, { key: elements.length, className: "text-sm space-y-0.5 ml-4 mb-1", style: { color: colors.text } }, ...listItems)
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
        <li key={listItems.length} className="list-disc">{renderInlineMarkdown(bulletMatch[1], colors)}</li>
      );
    } else if (numberMatch) {
      if (listType !== "number") { flushList(); listType = "number"; }
      listItems.push(
        <li key={listItems.length} className="list-decimal">{renderInlineMarkdown(numberMatch[2], colors)}</li>
      );
    } else {
      flushList();
      if (line.trim()) {
        elements.push(
          <p key={elements.length} className="text-sm mb-1" style={{ color: colors.text }}>
            {renderInlineMarkdown(line, colors)}
          </p>
        );
      } else {
        elements.push(<div key={elements.length} className="h-1" />);
      }
    }
  }
  flushList();

  return <>{elements}</>;
}

function renderInlineMarkdown(text: string, colors: ItemColors): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const remaining = text;
  let key = 0;

  // Match links [label](url), bold **text**, and plain text
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(remaining.slice(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      // Link
      parts.push(
        <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer"
          className="underline" style={{ color: colors.primary }}>
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      // Bold
      parts.push(<strong key={key++}>{match[3]}</strong>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < remaining.length) {
    parts.push(remaining.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
export function SectionItem({ item, colors }: SectionItemProps) {
  const t = useTranslations("editor");

  if (!item.visible) return null;

  // --- String Items ---
  if (isStringItem(item)) {
    switch (item.type) {
      case "heading":
        return (
          <h3 className="text-lg font-bold" style={{ color: colors.text }}>
            {item.value}
          </h3>
        );
      case "sub-heading":
        return (
          <h4 className="text-base font-semibold" style={{ color: colors.secondary }}>
            {item.value}
          </h4>
        );
      case "description":
        return <DescriptionBlock text={item.value} colors={colors} />;
      case "location":
        return (
          <span className="text-sm inline-flex items-center gap-1" style={{ color: colors.muted }}>
            <MapPinIcon className="size-3" />
            {item.value}
          </span>
        );
      case "email":
        return (
          <a
            href={`mailto:${item.value}`}
            className="text-sm inline-flex items-center gap-1 hover:underline"
            style={{ color: colors.muted }}
          >
            <MailIcon className="size-3" />
            {item.value}
          </a>
        );
      case "phone":
        return (
          <a
            href={`tel:${item.value}`}
            className="text-sm inline-flex items-center gap-1 hover:underline"
            style={{ color: colors.muted }}
          >
            <PhoneIcon className="size-3" />
            {item.value}
          </a>
        );
      case "tag":
        return (
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {item.value}
          </span>
        );
      default:
        return null;
    }
  }

  // --- Date Range ---
  if (isDateRangeItem(item)) {
    return (
      <span className="text-sm italic" style={{ color: colors.muted }}>
        {formatDateRange(item.value, t)}
      </span>
    );
  }

  // --- Links ---
  if (isLinkItem(item)) {
    return (
      <a
        href={item.value.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm inline-flex items-center gap-1 hover:underline"
        style={{ color: colors.primary }}
      >
        <LinkIcon className="size-3" />
        {item.value.label}
      </a>
    );
  }

  // --- Ratings ---
  if (isRatingItem(item)) {
    const { label, score, max, display } = item.value;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: colors.text }}>
          {label}
        </span>
        <div className="flex gap-0.5">
          {display === "stars" &&
            Array.from({ length: max }).map((_, i) => (
              <StarIcon
                key={i}
                className="size-4"
                fill={i < score ? colors.primary : "transparent"}
                stroke={colors.primary}
              />
            ))}
          {display === "dots" &&
            Array.from({ length: max }).map((_, i) => (
              <span
                key={i}
                className="size-2 rounded-full"
                style={{
                  backgroundColor: i < score ? colors.primary : colors.muted,
                }}
              />
            ))}
          {display === "bar" && (
            <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(score / max) * 100}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Separator ---
  if (item.type === "separator") {
    return <hr className="my-2 border-t" style={{ borderColor: colors.muted }} />;
  }

  return null;
}
