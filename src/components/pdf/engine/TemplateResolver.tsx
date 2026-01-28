import { pdfTemplates } from '../templates';
import type { Resume } from '@/types/resume';
import { PdfRenderer } from './PdfRenderer';
import { PdfTranslations } from './ItemRenderers';
import React from 'react';

export interface ResolvedTemplate {
  Template: React.ComponentType<{ resume: Resume; translations: PdfTranslations }>;
  type: 'config' | 'custom';
}

export const resolvePdfTemplate = (templateName: string): ResolvedTemplate => {
  const definition = pdfTemplates[templateName];
  
  if (!definition) {
    throw new Error(`PDF template "${templateName}" not found`);
  }
  
  if (definition.component) {
    return {
      Template: definition.component as React.ComponentType<{ resume: Resume; translations: PdfTranslations }>,
      type: 'custom'
    };
  }
  
  if (definition.config) {
    return {
      Template: ({ resume, translations }: { resume: Resume; translations: PdfTranslations }) => (
        <PdfRenderer resume={resume} template={definition.config!} translations={translations} />
      ),
       type: 'config'
    };
  }
  
  throw new Error(`Template "${templateName}" has no component or config`);
};
