
import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Resume, SectionContent, Item } from '@/types/resume';
import { ColorScheme, BasePdfStyles, basePdfStyles } from './PdfStyles';
import { PdfTranslations, renderPdfItem } from './ItemRenderers';
import { Style } from '@react-pdf/types';

export interface PdfTemplateConfig {
  name: string;
  styles: Partial<BasePdfStyles>;
}

// Helper to render section content based on layout
const renderSectionContent = (
  content: SectionContent,
  baseStyles: BasePdfStyles,
  overrideStyles: Partial<BasePdfStyles>,
  colors: ColorScheme,
  translations: PdfTranslations
) => {
  const { layout, columns = 1, items } = content;
  
  // Helper for applying styles with overrides
  const getStyle = (key: keyof BasePdfStyles, extra?: Style): Style[] => {
    return [
      baseStyles[key], 
      overrideStyles[key], 
      extra
    ].filter(Boolean) as Style[];
  };

  if (layout === 'grid') {
    return (
      <View style={getStyle('grid')}>
        {items.map((item: Item) => (
          <View 
            key={item.id} 
            style={[
              baseStyles.gridItem, 
              overrideStyles.gridItem, 
              { 
                width: `${100 / columns}%`, 
                paddingRight: ((Number(baseStyles.grid?.gap) || 8) / 2) 
              }
            ] as Style[]}
          >
            {renderPdfItem(item, baseStyles, colors, undefined, overrideStyles, translations)}
          </View>
        ))}
      </View>
    );
  }

  if (layout === 'inline') {
    return (
      <View style={getStyle('inline')}>
        {items.map((item: Item) => (
          <View key={item.id}>
            {renderPdfItem(item, baseStyles, colors, undefined, overrideStyles, translations)}
          </View>
        ))}
      </View>
    );
  }

  // Default list layout
  return (
    <View>
      {items.map((item: Item) => (
        <View key={item.id} style={getStyle('listItem')}>
          {renderPdfItem(item, baseStyles, colors, undefined, overrideStyles, translations)}
        </View>
      ))}
    </View>
  );
};

export const PdfRenderer = ({ 
  resume, 
  template,
  translations 
}: { 
  resume: Resume; 
  template: PdfTemplateConfig;
  translations: PdfTranslations;
}) => {
  const colors: ColorScheme = {
    ...resume.metadata.colors,
    accents: resume.metadata.colors.accents as string[]
  };
  
  const overrides = template.styles || {};
  
  // Helper for consistent style application
  const s = (key: keyof BasePdfStyles, extra?: Style) => {
    return [basePdfStyles[key], overrides[key], extra].filter(Boolean) as Style[];
  };

  return (
    <Document>
      <Page size="A4" style={s('page', { backgroundColor: colors.background })}>
        {/* Header Section */}
        <View style={s('header')}>
          <Text style={s('name', { color: colors.accents[0] || colors.text })}>{resume.personal.fullName}</Text>
          {resume.personal.jobTitle && (
            <Text style={s('jobTitle', { color: colors.accents[1] || colors.text })}>
              {resume.personal.jobTitle}
            </Text>
          )}
          
          <View style={s('contactRow')}>
            {resume.personal.details.map((item) => (
              <View key={item.id} style={s('contactItem')}>
                {renderPdfItem(item, basePdfStyles, colors, undefined, overrides, translations)}
              </View>
            ))}
          </View>
        </View>

        {/* Sections */}
        {resume.sections.map((section) => (
          <View key={section.id} style={s('section')}>
            <Text style={s('sectionTitle', { color: colors.accents[0] || colors.text, borderBottomColor: colors.accents[0] || colors.text })}>
              {section.title.toUpperCase()}
            </Text>
            <View style={s('sectionContent')}>
              {renderSectionContent(section.content, basePdfStyles, overrides, colors, translations)}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};