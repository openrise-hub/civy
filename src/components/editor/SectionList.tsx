"use client";

import type { SectionContent, Item } from "@/types/resume";
import { SectionItem, type ItemColors } from "@/components/editor/SectionItem";

interface SectionListProps {
  content: SectionContent;
  colors: ItemColors;
}

/**
 * SectionList - The Layout Manager
 * 
 * Responsibility: Determines HOW items are arranged.
 */
export function SectionList({ content, colors }: SectionListProps) {
  const { layout, columns = 3, items } = content;

  // --- Grid Layout (e.g., Skills section) ---
  if (layout === "grid") {
    return (
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <SectionItem key={item.id} item={item} colors={colors} />
        ))}
      </div>
    );
  }

  // --- Inline Layout (e.g., Tags displayed horizontally) ---
  if (layout === "inline") {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <SectionItem key={item.id} item={item} colors={colors} />
        ))}
      </div>
    );
  }

  // --- List Layout (default, e.g., Experience section) ---
  // Group consecutive bullets/numbers into <ul>/<ol> for proper HTML semantics
  const elements: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: typeof items } | null = null;

  for (const item of items) {
    const isBulletOrNumber = item.type === "bullet" || item.type === "number";

    if (isBulletOrNumber) {
      if (currentList && currentList.type === item.type) {
        // Continue the current list
        currentList.items.push(item);
      } else {
        // Flush previous list if exists
        if (currentList) {
          elements.push(renderList(currentList, colors));
        }
        // Start a new list
        currentList = { type: item.type as "bullet" | "number", items: [item] };
      }
    } else {
      // Flush the current list if we hit a non-list item
      if (currentList) {
        elements.push(renderList(currentList, colors));
        currentList = null;
      }
      elements.push(
        <SectionItem key={item.id} item={item} colors={colors} />
      );
    }
  }

  // Flush any remaining list
  if (currentList) {
    elements.push(renderList(currentList, colors));
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderList(
  list: { type: "bullet" | "number"; items: Item[] },
  colors: ItemColors
): React.ReactNode {
  const ListTag = list.type === "bullet" ? "ul" : "ol";
  return (
    <ListTag key={list.items[0].id} className={list.type === "bullet" ? "list-disc" : "list-decimal"}>
      {list.items.map((item) => (
        <SectionItem key={item.id} item={item} colors={colors} />
      ))}
    </ListTag>
  );
}
