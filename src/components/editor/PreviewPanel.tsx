"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

// Dynamic import to avoid SSR issues with pdfjs
const PdfCanvasPreview = dynamic(
  () => import("@/components/preview/PdfCanvasPreview").then((mod) => mod.PdfCanvasPreview),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    )
  }
);

// Memoized header to prevent re-renders
const PreviewHeader = memo(function PreviewHeader() {
  const t = useTranslations("editor.preview");

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <div className="flex items-center gap-2">
        {/* Zoom controls - TODO: implement zoom */}
        <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
          <ZoomOutIcon />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("zoom")}>
          <ZoomInIcon />
        </Button>
        <DownloadButton variant="outline" size="sm" />
      </div>
    </div>
  );
});

// Memoized preview content
const PreviewContent = memo(function PreviewContent() {
  const resume = useResumeStore((state) => state.resume);
  const tResume = useTranslations("resume");

  const translations = useMemo(() => ({
    present: tResume("present"),
    phone: tResume("phone"),
    email: tResume("email"),
    image: tResume("image"),
    location: tResume("location"),
    website: tResume("website"),
  }), [tResume]);

  return (
    <div className="flex-1 overflow-hidden relative">
      <PdfCanvasPreview 
        resume={resume} 
        translations={translations}
        templateName="modern"
      />
    </div>
  );
});

export function PreviewPanel() {
  return (
    <div className="flex h-full flex-col bg-muted/50">
      <PreviewHeader />
      <PreviewContent />
    </div>
  );
}
