"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useState } from "react";

function PreviewHeader({ 
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
}

function PreviewContent({ zoom }: { zoom: number }) {
  const resume = useResumeStore((state) => state.resume);
  const activeSectionId = useResumeStore((state) => state.activeSectionId);

  return (
    <div className="flex-1 overflow-auto bg-muted/50">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease',
        }}
      >
        <ResumePreview resume={resume} activeSectionId={activeSectionId} />
      </div>
    </div>
  );
}

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