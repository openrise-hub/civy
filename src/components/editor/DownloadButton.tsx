"use client";

import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { useResumeStore } from "@/stores/useResumeStore";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { DownloadIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonProps } from "@/components/ui/button";

interface DownloadButtonProps extends ButtonProps {
  fileName?: string;
}

export const DownloadButton = ({ 
  className, 
  variant = "default", 
  size = "sm",
  fileName,
  ...props 
}: DownloadButtonProps) => {
  const t = useTranslations("editor.preview");
  const tResume = useTranslations("resume");
  const [isGenerating, setIsGenerating] = useState(false);

  // Only access store when clicked, not on every render
  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Get current resume data at click time
      const resume = useResumeStore.getState().resume;
      
      const translations = {
        present: tResume("present"),
        phone: tResume("phone"),
        email: tResume("email"),
        image: tResume("image"),
        location: tResume("location"),
        website: tResume("website"),
      };

      const pdfDocument = (
        <UniversalPdf 
          resume={resume} 
          templateName="modern" 
          translations={translations} 
        />
      );

      const blob = await pdf(pdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `${resume.personal.fullName || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [fileName, tResume]);

  return (
    <Button 
      disabled={isGenerating} 
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      {...props}
    >
      {isGenerating ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : (
        <DownloadIcon className="size-4" />
      )}
      {isGenerating ? "Generating..." : t("download")}
    </Button>
  );
};
