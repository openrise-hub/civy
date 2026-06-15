"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileTextIcon } from "lucide-react";
import { SECTION_TEMPLATES } from "@/stores/useResumeStore";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SECTION_INFO: Record<string, { layout: string; items: string[] }> = {
  experience: {
    layout: "list",
    items: [
      "Job Title (heading)",
      "Date range from / to",
      "Description with bullet points for responsibilities and achievements",
    ],
  },
  education: {
    layout: "list",
    items: [
      "Degree / Program (heading)",
      "Date range from / to",
      "Description for relevant coursework, honors, or activities",
    ],
  },
  skills: {
    layout: "grid",
    items: ["Tags displayed as chips (pill, badge, outline, etc.)"],
  },
  summary: {
    layout: "list",
    items: ["Free-text description for your professional background and goals"],
  },
  custom: {
    layout: "list",
    items: [
      "Blank section for any content",
      "Supports bullet points (- prefix) and numbered lists (1. prefix)",
    ],
  },
};

export function SectionGuide({ isCollapsed }: { isCollapsed: boolean }) {
  const t = useTranslations("editor.sidebar");
  const tForm = useTranslations("editor.formEditor");
  const [open, setOpen] = useState(false);

  const sectionKeys = Object.keys(SECTION_TEMPLATES);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenuButton
        tooltip={isCollapsed ? t("sections") : undefined}
        onClick={() => setOpen(true)}
      >
        <FileTextIcon />
        <span>{t("sections")}</span>
      </SidebarMenuButton>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("sectionGuideTitle")}</DialogTitle>
          <DialogDescription>{t("sectionGuideDesc")}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="flex flex-col gap-4">
            {sectionKeys.map((key) => {
              const info = SECTION_INFO[key] || SECTION_INFO.custom;
              return (
                <div key={key} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{tForm(key)}</h3>
                    <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
                      {info.layout}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {info.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground pl-3 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-muted-foreground/40"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </DialogPanel>
      </DialogContent>
    </Dialog>
  );
}
