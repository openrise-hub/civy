"use client";

import { useTranslations } from "next-intl";
import { templateRegistry } from "@/lib/templates/registry";
import { Button } from "@/components/ui/button";
import { LayoutTemplateIcon } from "lucide-react";
import { useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { PRO_TEMPLATES } from "@/constants/limits";
import { tryTemplate } from "@/lib/resumes/actions";

export function TemplateOfTheWeek() {
  const t = useTranslations("dashboard");
  const { isPremium } = useUser();

  const template = useMemo(() => {
    let entries = Object.entries(templateRegistry);
    if (!isPremium) {
      entries = entries.filter(([key]) => !PRO_TEMPLATES.includes(key as never));
    }
    if (entries.length === 0) return null;
    const idx = new Date().getDate() % entries.length;
    return { key: entries[idx][0], entry: entries[idx][1] };
  }, [isPremium]);

  if (!template) return null;
  const { colors, typography, sectionTitles } = template.entry.config;

  return (
    <div className="rounded-xl border bg-background p-4">
      <h3 className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
        {t("templateOfTheWeek")}
      </h3>
      <div
        className="rounded-lg p-3 mb-3"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        <div
          style={{
            fontFamily: typography.fontFamily.name,
            fontSize: typography.fontSize.name,
            fontWeight: typography.bold.name ? 700 : 400,
            color: colors.name,
            marginBottom: 2,
          }}
          className="truncate text-base"
        >
          John Smith
        </div>
        <div
          style={{
            fontFamily: typography.fontFamily.headline,
            fontSize: typography.fontSize.headline,
            color: colors.headline,
            marginBottom: 6,
          }}
          className="text-xs truncate"
        >
          Software Engineer
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: colors.sectionTitles,
            opacity: 0.3,
            marginBottom: 4,
          }}
        />
        <div
          style={{
            fontFamily: typography.fontFamily.sectionTitles,
            fontSize: typography.fontSize.sectionTitles,
            fontWeight: typography.bold.sectionTitles ? 600 : 400,
            color: colors.sectionTitles,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          className="text-[10px] mb-1"
        >
          Experience
        </div>
        <div style={{ color: colors.body, fontSize: "7pt", fontFamily: typography.fontFamily.body }}>
          <div className="flex justify-between mb-1">
            <span style={{ fontWeight: 600 }}>Company</span>
            <span style={{ color: colors.connections }}>2020 – Now</span>
          </div>
          <div style={{ color: colors.body, opacity: 0.6 }}>
            Built scalable microservices...
          </div>
        </div>
      </div>
      <form action={tryTemplate}>
        <input type="hidden" name="template" value={template.key} />
        <Button type="submit" size="sm" variant="outline" className="w-full">
          <LayoutTemplateIcon className="size-3 mr-1" />
          {t("tryTemplate")}
        </Button>
      </form>
    </div>
  );
}
