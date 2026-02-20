"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/types/resume";
import type { PublicResumeData } from "@/lib/resumes/actions";
import { DownloadIcon, EyeIcon } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";

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

type Props = {
  resume: PublicResumeData;
  viewCount?: number;
};

export function PublicResumeViewer({ resume, viewCount }: Props) {
  const tResume = useTranslations("resume");

  const translations = useMemo(() => ({
    present: tResume("present"),
    phone: tResume("phone"),
    email: tResume("email"),
    image: tResume("image"),
    location: tResume("location"),
    website: tResume("website"),
  }), [tResume]);

  // Convert DB data to Resume type
  const resumeData = useMemo((): Resume => {
    const data = resume.data as {
      metadata?: Resume["metadata"];
      personal?: Resume["personal"];
      sections?: Resume["sections"];
    };

    return {
      id: resume.id,
      userId: "",
      title: resume.title,
      isPublic: true,
      metadata: data.metadata ?? {
        template: "modern",
        typography: { fontFamily: "inter", fontSize: "md" },
        colors: { background: "#ffffff", text: "#1f2937", accents: [] },
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
        templateName="modern" 
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

  return (
    <div className="min-h-dvh flex flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{resume.title}</span>
            {viewCount !== undefined && viewCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <EyeIcon className="size-3" />
                {viewCount.toLocaleString()}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <DownloadIcon className="size-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Preview */}
      <main className="flex-1 overflow-hidden">
        <PdfCanvasPreview 
          resume={resumeData} 
          translations={translations}
          templateName="modern"
        />
      </main>

      {/* Footer */}
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
