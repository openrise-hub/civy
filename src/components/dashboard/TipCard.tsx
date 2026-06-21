"use client";

import { LightbulbIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function TipCard() {
  const t = useTranslations("dashboard");
  const tips = t.raw("tips") as string[];
  if (!tips || tips.length === 0) return null;
  const tip = tips[new Date().getDate() % tips.length];

  return (
    <div className="rounded-xl border bg-muted/30 p-4 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <LightbulbIcon className="size-4 text-yellow-500" />
        <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          {t("tipTitle")}
        </span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{tip}</p>
    </div>
  );
}
