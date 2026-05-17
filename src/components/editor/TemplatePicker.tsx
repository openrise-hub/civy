"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, LayoutTemplateIcon } from "lucide-react";
import { templateRegistry, type TemplateEntry } from "@/lib/templates/registry";
import { useResumeStore } from "@/stores/useResumeStore";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function TemplateCard({
  entry,
  isActive,
  onSelect,
}: {
  entry: TemplateEntry;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { colors, typography, sectionTitles } = entry.config;

  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-xl border-2 p-4 text-left transition-all hover:border-ring hover:shadow-md ${
        isActive ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      {isActive && (
        <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" />
        </div>
      )}

      <div
        className="rounded-lg p-4 mb-3"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        <div
          style={{
            fontFamily: typography.fontFamily.name,
            fontSize: typography.fontSize.name,
            fontWeight: typography.bold.name ? 700 : 400,
            color: colors.name,
            marginBottom: 4,
          }}
        >
          John Smith
        </div>
        <div
          style={{
            fontFamily: typography.fontFamily.headline,
            fontSize: typography.fontSize.headline,
            color: colors.headline,
            marginBottom: 8,
          }}
        >
          Software Engineer
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: colors.sectionTitles,
            opacity: 0.3,
            marginBottom: 6,
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
            marginBottom: 4,
          }}
        >
          Experience
        </div>
        <div
          style={{
            color: colors.body,
            fontSize: "8pt",
            fontFamily: typography.fontFamily.body,
            lineHeight: 1.4,
          }}
        >
          <div style={{ marginBottom: 3, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>Company, Role</span>
            <span style={{ color: colors.connections, fontSize: "7pt" }}>2020 – Now</span>
          </div>
          <div style={{ color: colors.body, opacity: 0.6 }}>
            • Built scalable microservices...
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-1">{entry.name}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{entry.description}</p>
    </button>
  );
}

export function TemplatePicker({ isCollapsed }: { isCollapsed: boolean }) {
  const t = useTranslations("editor.sidebar");
  const [open, setOpen] = useState(false);
  const currentTemplate = useResumeStore((s) => s.resume.metadata.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  const templates = Object.values(templateRegistry);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenuButton
        tooltip={isCollapsed ? t("templates") : undefined}
        onClick={() => setOpen(true)}
      >
        <LayoutTemplateIcon />
        <span>{t("templates")}</span>
      </SidebarMenuButton>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("chooseTemplate")}</DialogTitle>
          <DialogDescription>{t("chooseTemplateDesc")}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((entry) => (
              <TemplateCard
                key={entry.name}
                entry={entry}
                isActive={currentTemplate === entry.name.toLowerCase()}
                onSelect={() => {
                  setTemplate(entry.name.toLowerCase());
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </DialogPanel>
      </DialogContent>
    </Dialog>
  );
}
