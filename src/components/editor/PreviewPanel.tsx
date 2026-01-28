"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

// Dynamic import for PDFViewer to avoid SSR issues, maybe I can figure out a better solution for this, could there be a library to handle this?
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <p>Loading PDF Engine...</p> }
);

export function PreviewPanel() {
  const t = useTranslations("editor.preview");
  const tResume = useTranslations("resume");
  const { resume } = useResumeStore();

  const translations = {
    present: tResume("present"),
    phone: tResume("phone"),
    email: tResume("email"),
    image: tResume("image"),
    location: tResume("location"),
    website: tResume("website"),
  };

  return (
    <div className="flex h-full flex-col bg-muted/50">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <div className="flex items-center gap-2">
          {/* Zoom controls are native in PDF viewer mostly, but keeping UI for now */}
          <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
            <ZoomOutIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
            <ZoomInIcon />
          </Button>
          <DownloadButton variant="outline" size="sm" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <PDFViewer 
          className="w-full h-full border-none"
          showToolbar={false}
        >
          <UniversalPdf resume={resume} templateName="modern" translations={translations} />
        </PDFViewer>
      </div>
    </div>
  );
}
