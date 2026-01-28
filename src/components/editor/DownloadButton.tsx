"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useResumeStore } from "@/stores/useResumeStore";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/useIsMounted";

// Dynamically import PDFDownloadLink to avoid SSR issues with react-pdf
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

import { ButtonProps } from "@/components/ui/button";

interface DownloadButtonProps extends ButtonProps {
  fileName?: string;
}

export const DownloadButton = ({ className, variant = "default", size = "sm", ...props }: DownloadButtonProps) => {
  const { resume } = useResumeStore();
  const t = useTranslations("editor.preview");
  const tResume = useTranslations("resume");
  const isMounted = useIsMounted();

  // Construct translations object for the PDF Engine
  const translations = {
    present: tResume("present"),
    phone: tResume("phone"),
    email: tResume("email"),
    image: tResume("image"),
    location: tResume("location"),
    website: tResume("website"),
  };

  if (!isMounted) {
    return (
      <Button disabled variant={variant} size={size} className={className} {...props}>
        <DownloadIcon className="size-4 mr-2" />
        {t("download")}
      </Button>
    );
  }

  const fileName = props.fileName || `${resume.personal.fullName || "resume"}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <UniversalPdf 
          resume={resume} 
          templateName="modern" 
          translations={translations} 
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <Button 
          disabled={loading} 
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          <DownloadIcon className="size-4" />
          {loading ? "Generating..." : t("download")}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
