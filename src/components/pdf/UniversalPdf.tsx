"use client";

import React from 'react';
import type { Resume } from '@/types/resume';
import { resolvePdfTemplate } from './engine/TemplateResolver';
import { Text, Document, Page } from '@react-pdf/renderer';

import { PdfTranslations } from './engine/ItemRenderers';

interface UniversalPdfProps {
  resume: Resume;
  templateName?: string;
  translations: PdfTranslations;
}

export const UniversalPdf = ({ resume, templateName = 'modern', translations }: UniversalPdfProps) => {
  let TemplateComponent: React.ComponentType<{ resume: Resume; translations: PdfTranslations }>;

  try {
    const { Template } = resolvePdfTemplate(templateName);
    TemplateComponent = Template as React.ComponentType<{ resume: Resume; translations: PdfTranslations }>;
  } catch (error) {
    console.error(`Failed to load template "${templateName}":`, error);
    
    // Fallback error document
    return (
      <Document>
        <Page style={{ padding: 40 }}>
          <Text style={{ color: 'red', fontSize: 16 }}>
            Error loading template: {templateName}
          </Text>
        </Page>
      </Document>
    );
  }

  return <TemplateComponent resume={resume} translations={translations} />;
};
