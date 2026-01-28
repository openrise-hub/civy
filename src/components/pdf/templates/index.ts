import type { Resume } from '@/types/resume';
import type { PdfTemplateConfig } from '../engine/PdfRenderer';
import { modernPdfConfig } from './modern/config';
import { PdfTranslations } from '../engine/ItemRenderers';

export interface PdfTemplateDefinition {
  name: string;
  config?: PdfTemplateConfig;
  component?: React.ComponentType<{ resume: Resume; translations?: PdfTranslations }>;
}

export const pdfTemplates: Record<string, PdfTemplateDefinition> = {
  modern: {
    name: 'Modern',
    config: modernPdfConfig,
  },
  // Future templates will be added here
};
