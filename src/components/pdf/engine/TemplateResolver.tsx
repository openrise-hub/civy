import type { Resume } from '@/types/resume';
import type { TemplateConfig } from '@/types/template';
import { resolveTemplateConfig } from '@/lib/templates/resolver';
import { PdfRenderer } from './PdfRenderer';
import { PdfTranslations } from './ItemRenderers';
import React from 'react';

export interface ResolvedTemplate {
  Template: React.ComponentType<{ resume: Resume; translations: PdfTranslations }>;
  type: 'config' | 'custom';
}

export const resolvePdfTemplate = (
  templateName: string,
  userOverrides?: Partial<TemplateConfig>
): ResolvedTemplate => {
  const config = resolveTemplateConfig(templateName, userOverrides);

  return {
    Template: ({ resume, translations }: { resume: Resume; translations: PdfTranslations }) => (
      <PdfRenderer resume={resume} templateConfig={config} translations={translations} />
    ),
    type: 'config',
  };
};
