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
 * SectionItem - The Content Atom
 * 
 * Responsibility: Renders WHAT the content is based on semantic type.
 */
export function SectionItem({ item, colors }: SectionItemProps) {
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
      case "text":
        return (
          <p className="text-sm" style={{ color: colors.text }}>
            {item.value}
          </p>
        );
      case "bullet":
        return (
          <li className="text-sm ml-4 list-disc" style={{ color: colors.text }}>
            {item.value}
          </li>
        );
      case "number":
        return (
          <li className="text-sm ml-4 list-decimal" style={{ color: colors.text }}>
            {item.value}
          </li>
        );
      case "date":
        return (
          <span className="text-sm italic" style={{ color: colors.muted }}>
            {item.value}
          </span>
        );
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
        {formatDateRange(item.value)}
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
