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
          <div key={item.id} className={item.type === "tags" ? "col-span-full" : ""}>
            <SectionItem item={item} colors={colors} />
          </div>
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
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <SectionItem key={item.id} item={item} colors={colors} />
      ))}
    </div>
  );
}

function renderList(
  list: { type: string; items: Item[] },
  colors: ItemColors
): React.ReactNode {
  return (
    <div key={list.items[0].id}>
      {list.items.map((item) => (
        <SectionItem key={item.id} item={item} colors={colors} />
      ))}
    </div>
  );
}
