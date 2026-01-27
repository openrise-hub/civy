"use client";

import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
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
          {/* PDF Preview Container - A4 aspect ratio placeholder */}
          <div
            className="w-full max-w-[595px] bg-white shadow-lg rounded-sm border"
            style={{ aspectRatio: "1 / 1.414" }}
          >
            {/* Resume Preview Content */}
            <div className="p-8 space-y-4">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {resume.personal.fullName}
                </h1>
                {resume.personal.jobTitle && (
                  <p className="text-gray-600">{resume.personal.jobTitle}</p>
                )}
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  {resume.personal.details
                    .filter((d) => d.visible)
                    .map((detail) => (
                      <span key={detail.id}>
                        {String(detail.value)}
                      </span>
                    ))}
                </div>
              </div>

              {resume.sections
                .filter((s) => s.visible)
                .map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                      {section.title}
                    </h2>
                    <div className="space-y-1">
                      {section.content.items
                        .filter((item) => item.visible)
                        .map((item) => (
                          <div key={item.id} className="text-sm text-gray-700">
                            {typeof item.value === "string"
                              ? item.value
                              : JSON.stringify(item.value)}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
