"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ZoomInIcon, ZoomOutIcon, Loader2 } from "lucide-react";
import { useState } from "react";

// Dynamic import to avoid SSR issues with pdfjs
const PdfCanvasPreview = dynamic(
  () => import("@/components/preview/PdfCanvasPreview").then((mod) => mod.PdfCanvasPreview),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Loader2 className="size-8 animate-spin text-muted-foreground/50" />
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    )
  }
);

// Memoized header to prevent re-renders
const PreviewHeader = memo(function PreviewHeader({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset 
}: { 
  zoom: number; 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onZoomReset: () => void; 
}) {
  const t = useTranslations("editor.preview");

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
          <Button 
            size="icon-sm" 
            variant="ghost" 
            onClick={onZoomOut} 
            disabled={zoom <= 0.5}
            aria-label={t("zoom")}
          >
            <ZoomOutIcon className="size-4" />
          </Button>
          <button 
            onClick={onZoomReset}
            className="text-[10px] font-medium w-12 hover:text-primary transition-colors text-center"
            title="Reset Zoom"
          >
           {Math.round(zoom * 100)}%
          </button>
          <Button 
            size="icon-sm" 
            variant="ghost" 
            onClick={onZoomIn} 
            disabled={zoom >= 2}
            aria-label={t("zoom")}
          >
            <ZoomInIcon className="size-4" />
          </Button>
        </div>
        <DownloadButton variant="outline" size="sm" />
      </div>
    </div>
  );
});

// Memoized preview content
const PreviewContent = memo(function PreviewContent({ zoom }: { zoom: number }) {
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
        zoom={zoom}
      />
    </div>
  );
});

export function PreviewPanel() {
  const [zoom, setZoom] = useState(1);
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="flex h-full flex-col bg-muted/50">
      <PreviewHeader 
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
      <PreviewContent zoom={zoom} />
    </div>
  );
}
