"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { ZoomInIcon, ZoomOutIcon, RulerIcon, SearchCheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function PreviewHeader({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset,
  showGuides,
  onToggleGuides,
  analyzing,
  onATSCheck,
}: { 
  zoom: number; 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onZoomReset: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  analyzing: boolean;
  onATSCheck: () => void;
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
            title={t("resetZoom")}
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
        <Button
          size="icon-sm"
          variant={showGuides ? "secondary" : "ghost"}
          onClick={onToggleGuides}
          aria-label={t("showGuides")}
          title={t("showGuides")}
        >
          <RulerIcon className="size-4" />
        </Button>
        <DownloadButton variant="outline" size="sm" />
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onATSCheck}
          disabled={analyzing}
          aria-label={t("atsCheck")}
          title={t("atsCheck")}
        >
          {analyzing ? <Loader2Icon className="size-4 animate-spin" /> : <SearchCheckIcon className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function PreviewContent({ zoom, showGuides }: { zoom: number; showGuides: boolean }) {
  const resume = useResumeStore((state) => state.resume);
  const activeSectionId = useResumeStore((state) => state.activeSectionId);

  return (
    <div className="flex-1 overflow-auto bg-muted/50">
      <div style={{ display: "flex", justifyContent: "center", minWidth: "fit-content" }}>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
          }}
        >
          <ResumePreview resume={resume} activeSectionId={activeSectionId} showGuides={showGuides} />
        </div>
      </div>
    </div>
  );
}

export function PreviewPanel() {
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<{ score: number; issues: string[]; suggestions: string[] } | null>(null);
  const [atsOpen, setAtsOpen] = useState(false);
  const resume = useResumeStore((state) => state.resume);
  const t = useTranslations("editor.preview");
  const locale = useLocale();
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);
  const handleToggleGuides = () => setShowGuides(prev => !prev);

  const handleATSCheck = async () => {
    setAnalyzing(true);
    try {
      const parts: string[] = [resume.personal.fullName, resume.personal.jobTitle || ""].filter(Boolean);
      for (const section of resume.sections) {
        if (section.visible === false) continue;
        const items = section.content.items
          .filter((i) => i.visible !== false && i.type !== "separator")
          .map((i) => ("value" in i ? (typeof i.value === "string" ? i.value : JSON.stringify(i.value)) : ""))
          .filter(Boolean);
        if (items.length > 0) {
          parts.push(`\n${section.title.toUpperCase()}\n${items.join("\n")}`);
        }
      }
      const res = await fetch("/api/ai/ats-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: parts.join("\n"), locale }),
      });
      const data = await res.json();
      setAtsResult(data);
      setAtsOpen(true);
    } catch {
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/50">
      <PreviewHeader 
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        showGuides={showGuides}
        onToggleGuides={handleToggleGuides}
        analyzing={analyzing}
        onATSCheck={handleATSCheck}
      />
      <PreviewContent zoom={zoom} showGuides={showGuides} />

      <Dialog open={atsOpen} onOpenChange={setAtsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("atsAnalysis")}</DialogTitle>
          </DialogHeader>
          {atsResult && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{t("atsScore")}:</span>
                <span className={atsResult.score >= 70 ? "text-green-600" : "text-amber-600"}>
                  {atsResult.score}/100
                </span>
              </div>
              {atsResult.issues.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">{t("atsIssues")}</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {atsResult.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {atsResult.suggestions.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">{t("atsSuggestions")}</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {atsResult.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}