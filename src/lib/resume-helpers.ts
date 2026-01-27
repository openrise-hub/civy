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
  return item.type === "link" || item.type === "social";
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

export function formatDateRange(value: DateRangeItem["value"]): string {
  const start = value.startDate;
  const end = value.endDate || "Present"; // TODO: i18n
  return `${start} - ${end}`;
}

// --- Label Helpers ---

export function getItemTypeLabel(type: StringItem["type"]): string {
  // TODO: Move to i18n
  const labels: Record<StringItem["type"], string> = {
    heading: "Heading",
    "sub-heading": "Sub-heading",
    text: "Text",
    bullet: "Bullet",
    number: "Number",
    date: "Date",
    location: "Location",
    phone: "Phone",
    email: "Email",
    tag: "Tag",
  };
  return labels[type] || type;
}
