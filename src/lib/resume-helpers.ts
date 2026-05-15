import type {
  Item,
  StringItem,
  DateRangeItem,
  LinkItem,
  RatingItem,
  SeparatorItem,
  ImageItem,
} from "@/types/resume";
import { parse, isValid } from "date-fns";

// --- Type Guards ---

export function isStringItem(item: Item): item is StringItem {
  return "value" in item && typeof item.value === "string";
}

export function isDateRangeItem(item: Item): item is DateRangeItem {
  return item.type === "date-range";
}

export function isLinkItem(item: Item): item is LinkItem {
  return item.type === "link";
}

export function isRatingItem(item: Item): item is RatingItem {
  return item.type === "rating";
}

export function isImageItem(item: Item): item is ImageItem {
  return item.type === "image";
}

export function isSeparatorItem(item: Item): item is SeparatorItem {
  return item.type === "separator";
}

// --- Formatters ---

export function formatDateRange(
  value: DateRangeItem["value"],
  t: (key: string) => string
): string {
  const fmt = (d: string | undefined) => {
    if (!d) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ym = d.match(/^(\d{4})-(\d{2})$/);
    if (ym) return `${months[parseInt(ym[2], 10) - 1]} ${ym[1]}`;
    const ymd = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) return `${months[parseInt(ymd[2], 10) - 1]} ${parseInt(ymd[3], 10)}, ${ymd[1]}`;
    return d;
  };
  const start = fmt(value.startDate);
  if (!start) return "";
  const end = value.endDate !== undefined ? fmt(value.endDate) : t("present");
  return `${start} - ${end}`;
}

// --- Label Helpers ---

export function getItemTypeLabel(
  type: StringItem["type"],
  t: (key: string) => string
): string {
  const labels: Record<StringItem["type"], string> = {
    heading: t("types.heading"),
    "sub-heading": t("types.sub-heading"),
    description: t("types.description"),
    location: t("types.location"),
    phone: t("types.phone"),
    email: t("types.email"),
    tag: t("types.tag"),
  };
  return labels[type] || type;
}

// --- Date Validation ---

export function parseDateValue(value: string): Date | null {
  if (!value) return null;
  const d = parse(value, "yyyy-MM-dd", new Date());
  if (isValid(d)) return d;
  const m = parse(value, "yyyy-MM", new Date());
  if (isValid(m)) return m;
  const y = parse(value, "yyyy", new Date());
  if (isValid(y)) return y;
  return null;
}

export function validateDateRange(start: string, end: string | undefined): string | null {
  if (!start) return "Start date is required";

  const startDate = parseDateValue(start);
  if (!startDate) return "Invalid start date format";

  if (startDate.getFullYear() < 1935) return "Date must be 1935 or later";
  if (startDate > new Date()) return "Start date cannot be in the future";

  if (end !== undefined) {
    if (!end) return "End date is required";

    const endDate = parseDateValue(end);
    if (!endDate) return "Invalid end date format";

    if (endDate.getFullYear() < 1935) return "Date must be 1935 or later";
    if (endDate > new Date()) return "End date cannot be in the future";

    if (endDate.getTime() <= startDate.getTime()) return "End date must be after start date";
  }

  return null;
}
