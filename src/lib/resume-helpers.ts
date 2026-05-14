import type {
  Item,
  StringItem,
  DateRangeItem,
  LinkItem,
  RatingItem,
  SeparatorItem,
  ImageItem,
} from "@/types/resume";

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
  const fmt = (d: string) => {
    const match = d.match(/^(\d{4})-(\d{2})$/);
    if (match) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(match[2], 10) - 1]} ${match[1]}`;
    }
    return d;
  };
  const start = fmt(value.startDate);
  const end = value.endDate ? fmt(value.endDate) : t("present");
  if (!value.startDate && !value.endDate) return "";
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
