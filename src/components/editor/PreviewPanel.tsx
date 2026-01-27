"use client";

import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { ModernTemplate } from "@/components/preview/templates/ModernTemplate";
import { DownloadIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

export function PreviewPanel() {
  const t = useTranslations("editor.preview");
  const { resume } = useResumeStore();

  return (
    <div className="flex h-full flex-col bg-muted/50">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <div className="flex items-center gap-2">
          <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
            <ZoomOutIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
            <ZoomInIcon />
          </Button>
          <Button size="sm" variant="outline">
            <DownloadIcon className="size-4" />
            <span>{t("download")}</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex items-start justify-center p-6">
          <div
            className="w-full max-w-[595px] bg-white shadow-lg rounded-sm border overflow-hidden"
            style={{ aspectRatio: "1 / 1.414" }}
          >
            <ModernTemplate resume={resume} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
