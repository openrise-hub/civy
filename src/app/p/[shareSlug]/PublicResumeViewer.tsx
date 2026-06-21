"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/types/resume";
import type { PublicResumeData } from "@/lib/resumes/actions";
import { DownloadIcon, EyeIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { ResumePreview } from "@/components/preview/ResumePreview";

type Props = {
  resume: PublicResumeData;
  viewCount?: number;
};

export function PublicResumeViewer({ resume, viewCount }: Props) {
  const tResume = useTranslations("resume");
  const [zoom, setZoom] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useLayoutEffect(() => {
    if (initialized.current) return;
    const el = contentRef.current;
    if (!el) return;
    const availHeight = el.clientHeight;
    if (availHeight <= 0) return;
    const pageSizes: Record<string, number> = { "a4": 1123, "us-letter": 1056 };
    const pageH = pageSizes["a4"];
    const fitScale = (availHeight - 32) / pageH;
    setZoom(Math.min(fitScale, 1.5));
    initialized.current = true;
  }, []);

  const translations = useMemo(() => ({
    present: tResume("present"),
    phone: tResume("phone"),
    email: tResume("email"),
    image: tResume("image"),
    location: tResume("location"),
    website: tResume("website"),
  }), [tResume]);

  const resumeData = useMemo((): Resume => {
    const data = resume.data as {
      metadata?: Resume["metadata"];
      personal?: Resume["personal"];
      sections?: Resume["sections"];
    };

    const metadata = (data.metadata ?? {}) as Resume["metadata"];
    const templateName = metadata.template || "modern";

    return {
      id: resume.id,
      userId: "",
      title: resume.title,
      isPublic: true,
      metadata: {
        ...metadata,
        template: templateName,
        templateConfig: metadata.templateConfig,
        typography: metadata.typography ?? { fontFamily: "inter", fontSize: "md" },
        colors: metadata.colors ?? { background: "#ffffff", text: "#1f2937", accents: [] },
      },
      personal: data.personal ?? { fullName: "", details: [] },
      sections: data.sections ?? [],
      createdAt: "",
      updatedAt: "",
    };
  }, [resume]);

  const handleDownload = async () => {
    const pdfDocument = (
      <UniversalPdf 
        resume={resumeData} 
        templateName={resumeData.metadata.template} 
        templateConfig={resumeData.metadata.templateConfig}
        translations={translations} 
      />
    );

    const blob = await pdf(pdfDocument).toBlob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resumeData.personal.fullName || "resume"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setZoom(p => Math.min(p + 0.1, 2));
  const handleZoomOut = () => setZoom(p => Math.max(p - 0.1, 0.3));

  return (
    <div className="min-h-dvh flex flex-col bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">{resume.title}</span>
            {viewCount !== undefined && viewCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <EyeIcon className="size-3" />
                {viewCount.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
              <Button size="icon-sm" variant="ghost" onClick={handleZoomOut} disabled={zoom <= 0.3}>
                <ZoomOutIcon className="size-4" />
              </Button>
              <span className="text-[10px] font-medium w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button size="icon-sm" variant="ghost" onClick={handleZoomIn} disabled={zoom >= 2}>
                <ZoomInIcon className="size-4" />
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <DownloadIcon className="size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative">
        <div
          ref={contentRef}
          className="absolute inset-0 flex justify-center"
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <ResumePreview resume={resumeData} />
          </div>
        </div>
      </main>

      <footer className="border-t bg-background py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Built with{" "}
          <Link href="/" className="text-primary hover:underline font-medium">
            Civy
          </Link>
        </p>
      </footer>
    </div>
  );
}
