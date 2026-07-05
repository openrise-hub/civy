"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { DownloadButton } from "@/components/editor/DownloadButton";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { ZoomInIcon, ZoomOutIcon, RulerIcon, SearchCheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toastManager } from "@/components/ui/toast";

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
  const [atsResult, setAtsResult] = useState<{
    score: number;
    rewrittenResume: string;
    topIssues: string[];
    keywordGaps: string[];
    matchVerdict?: string;
  } | null>(null);
  const [atsOpen, setAtsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const resume = useResumeStore((state) => state.resume);
  const t = useTranslations("editor.preview");
  const ta = useTranslations("ai");
  const locale = useLocale();
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);
  const handleToggleGuides = () => setShowGuides(prev => !prev);

  const handleATSCheck = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/ats-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: buildResumeText(),
          jobDescription: jobDescription.trim() || undefined,
          locale,
        }),
      });
      const data = await res.json();
      if (data.error) {
        toastManager.add({ type: "error", title: ta(data.error) || data.error });
        return;
      }
      setAtsResult(data);
      setAtsOpen(true);
    } catch {
    } finally {
      setAnalyzing(false);
    }
  };

  const buildResumeText = () => {
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
    return parts.join("\n");
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("atsAnalysis")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t("atsJobDescriptionPlaceholder")}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            <Button
              onClick={handleATSCheck}
              disabled={analyzing}
              className="w-full"
              size="sm"
            >
              {analyzing ? <Loader2Icon className="size-4 animate-spin mr-2" /> : <SearchCheckIcon className="size-4 mr-2" />}
              {analyzing ? t("atsCheckRunning") : t("atsCheckRun")}
            </Button>
          </div>

          {atsResult && (
            <div className="space-y-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{t("atsScore")}:</span>
                <span className={atsResult.score >= 70 ? "text-green-600 font-bold text-lg" : "text-amber-600 font-bold text-lg"}>
                  {atsResult.score}/100
                </span>
              </div>

              {atsResult.matchVerdict && (
                <div className={`rounded-lg px-3 py-2 text-sm ${atsResult.score >= 70 ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                  {atsResult.matchVerdict}
                </div>
              )}

              {atsResult.keywordGaps.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">{t("atsKeywordGaps")}:</p>
                  <div className="flex flex-wrap gap-1">
                    {atsResult.keywordGaps.map((kw, i) => (
                      <span key={i} className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {atsResult.topIssues.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">{t("atsTopIssues")}:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {atsResult.topIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {atsResult.rewrittenResume && (
                <div>
                  <p className="font-semibold mb-1">{t("atsRewritten")}</p>
                  <p className="text-xs text-muted-foreground mb-2">{t("atsPreviewNote")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/20 p-3 max-h-80 overflow-y-auto">
                      <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{t("atsOriginal")}</p>
                      <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed">{buildResumeText()}</pre>
                    </div>
                    <div className="rounded-lg border bg-primary/5 p-3 max-h-80 overflow-y-auto">
                      <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{t("atsRewritten")}</p>
                      <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">{atsResult.rewrittenResume}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}