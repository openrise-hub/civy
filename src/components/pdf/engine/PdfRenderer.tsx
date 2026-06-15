import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import type { Resume, SectionContent, Item } from '@/types/resume';
import type { TemplateConfig } from '@/types/template';
import { PdfTranslations, renderPdfItem } from './ItemRenderers';
import { Style } from '@react-pdf/types';
import "@/lib/fonts/register";

// Helper to convert CSS-like values to numbers where possible
function parseDimension(val: string): number {
  const num = parseFloat(val);
  if (val.endsWith('pt')) return num * 1.333; // pt to px (approx)
  if (val.endsWith('cm')) return num * 37.8;   // cm to px (approx)
  if (val.endsWith('mm')) return num * 3.78;   // mm to px
  if (val.endsWith('in')) return num * 96;     // in to px
  if (val.endsWith('em')) return num * 12;     // em to px (approx at 12pt base)
  if (val.endsWith('px')) return num;
  return num || 0;
}

function parseFontSize(val: string): number {
  const num = parseFloat(val);
  if (val.endsWith('pt')) return num;
  if (val.endsWith('em')) return num * 10; // em relative to base 10pt
  return num || 10;
}

// Parse lineSpacing: @react-pdf/renderer expects a unitless lineHeight multiplier.
// Unitless values ("1.5") are used as-is. Suffixed values represent ADDITIONAL
// spacing between lines, so "0.6em" becomes 1.6 (1 + 0.6).
function parseLineSpacing(val: string): number {
  const num = parseFloat(val);
  if (val.endsWith('em')) return 1 + num;
  if (val.endsWith('pt')) return 1 + num / 10;
  return num || 1.4;
}

// Build styles from TemplateConfig for @react-pdf/renderer
function buildStyles(config: TemplateConfig) {
  const { colors, typography, page, sectionTitles, header, entries, links } = config;

  const fontSize = {
    body: parseFontSize(typography.fontSize.body),
    name: parseFontSize(typography.fontSize.name),
    entryHeading: parseFontSize(typography.fontSize.entryHeading),
    headline: parseFontSize(typography.fontSize.headline),
    connections: parseFontSize(typography.fontSize.connections),
    sectionTitles: parseFontSize(typography.fontSize.sectionTitles),
  };

  return {
    page: {
      paddingTop: parseDimension(page.topMargin),
      paddingBottom: parseDimension(page.bottomMargin),
      paddingLeft: parseDimension(page.leftMargin),
      paddingRight: parseDimension(page.rightMargin),
      fontFamily: typography.fontFamily.body,
      fontSize: fontSize.body,
      lineHeight: parseLineSpacing(typography.lineSpacing),
      backgroundColor: colors.body === 'rgb(31, 41, 55)' ? '#ffffff' : '#ffffff',
      color: colors.body,
      height: page.size === 'a4' ? 842 : 792,
    },
    name: {
      fontSize: fontSize.name,
      fontFamily: typography.fontFamily.name,
      fontWeight: typography.bold.name ? 'bold' : 'normal',
      color: colors.name,
      fontStyle: typography.smallCaps.name ? undefined : undefined,
    },
    entryHeading: {
      fontSize: fontSize.entryHeading,
      fontFamily: typography.fontFamily.name,
      fontWeight: typography.bold.entryHeading ? 'bold' : 'normal',
      color: colors.name,
    },
    headline: {
      fontSize: fontSize.headline,
      fontFamily: typography.fontFamily.headline,
      fontWeight: typography.bold.headline ? 'bold' : 'normal',
      color: colors.headline,
    },
    header: {
      flexDirection: 'column' as const,
      alignItems: header.alignment === 'center' ? 'center' as const : header.alignment === 'right' ? 'flex-end' as const : 'flex-start' as const,
      marginBottom: parseDimension(header.spaceBelowConnections),
    },
    nameRow: {
      marginBottom: parseDimension(header.spaceBelowName),
    },
    headlineRow: {
      marginBottom: parseDimension(header.spaceBelowHeadline),
    },
    contactRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: header.alignment === 'center' ? 'center' as const : 'flex-start' as const,
      gap: parseDimension(header.connections.spaceBetweenConnections),
      marginBottom: 0,
    },
    contactItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 4,
      fontFamily: typography.fontFamily.connections,
      fontSize: fontSize.connections,
      color: colors.connections,
    },
    section: {
      marginBottom: parseDimension(sectionTitles.spaceAbove) + parseDimension(sectionTitles.spaceBelow) + 4,
    },
    sectionTitle: {
      fontSize: fontSize.sectionTitles,
      fontFamily: typography.fontFamily.sectionTitles,
      fontWeight: typography.bold.sectionTitles ? 'bold' : 'normal',
      textTransform: 'uppercase' as const,
      color: colors.sectionTitles,
      borderBottomWidth: sectionTitles.type !== 'without_line' ? parseFloat(sectionTitles.lineThickness) : 0,
      borderBottomStyle: 'solid' as const,
      borderBottomColor: colors.sectionTitles,
      marginBottom: parseDimension(sectionTitles.spaceBelow),
      paddingBottom: 4,
    },
    sectionContent: {
      marginTop: 4,
    },
    listItem: {
      marginBottom: parseDimension(entries.spaceBetweenColumns) || 8,
    },
    bulletRow: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: 4,
      marginLeft: parseDimension(entries.highlights.spaceLeft),
      marginBottom: parseDimension(entries.highlights.spaceBetweenItems),
    },
    ratingRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
    },
    ratingLabel: {
      fontSize: fontSize.connections,
      marginRight: 8,
      color: colors.body,
    },
    barContainer: {
      width: 60,
      height: 6,
      backgroundColor: '#e5e7eb',
      borderRadius: 3,
    },
    barFill: {
      height: '100%' as const,
      borderRadius: 3,
      backgroundColor: colors.sectionTitles,
    },
    dotsContainer: {
      flexDirection: 'row' as const,
      gap: 3,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    grid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 8,
    },
    gridRow: {
      flexDirection: 'row' as const,
      gap: 8,
    },
    gridItem: {
      flex: 1,
    },
    inline: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 6,
    },
    footer: page.showFooter ? {
      position: 'absolute' as const,
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center' as const,
      fontSize: fontSize.connections,
      fontFamily: typography.fontFamily.connections,
      color: colors.footer,
    } : undefined,
    topNote: page.showTopNote ? {
      fontSize: fontSize.connections,
      fontFamily: typography.fontFamily.connections,
      color: colors.topNote,
      marginBottom: 12,
    } : undefined,
    connectorFontSize: fontSize.connections,
    linkDecoration: links.underline ? 'underline' as const : 'none' as const,
  };
}

// Helper to render section content based on layout
const renderSectionContent = (
  content: SectionContent,
  styles: ReturnType<typeof buildStyles>,
  colors: TemplateConfig['colors'],
  translations: PdfTranslations
) => {
  const { layout, columns = 1, items } = content;
  const visibleItems = items.filter((i: Item) => i.visible !== false);

  if (layout === 'grid') {
    return (
      <View style={styles.grid}>
        {visibleItems.map((item: Item) => (
          <View
            key={item.id}
            style={{
              ...styles.gridItem,
              width: item.type === 'tags' ? '100%' : `${100 / columns}%`,
            }}
          >
            {renderPdfItem(item, styles as unknown as Record<string, Style | undefined>, colors, undefined, translations)}
          </View>
        ))}
      </View>
    );
  }

  if (layout === 'inline') {
    return (
      <View style={styles.inline}>
        {visibleItems.map((item: Item) => (
          <View key={item.id}>
            {renderPdfItem(item, styles as unknown as Record<string, Style | undefined>, colors, undefined, translations)}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {visibleItems.map((item: Item) => (
        <View key={item.id} style={styles.listItem}>
          {renderPdfItem(item, styles as unknown as Record<string, Style | undefined>, colors, undefined, translations)}
        </View>
      ))}
    </View>
  );
};

function formatTemplateString(template: string, values: Record<string, string>): string {
  return template.replace(/\b([A-Z_]+)\b/g, (match) => values[match] || match);
}

export const PdfRenderer = ({
  resume,
  templateConfig,
  translations,
}: {
  resume: Resume;
  templateConfig: TemplateConfig;
  translations: PdfTranslations;
}) => {
  const styles = buildStyles(templateConfig);
  const { colors, templates: tmpl } = templateConfig;
  const pageKey = templateConfig.page.size === 'us-letter' ? 'LETTER' : 'A4' as const;
  const showFooter = resume.metadata.showFooter ?? templateConfig.page.showFooter;
  const showTopNote = resume.metadata.showTopNote ?? templateConfig.page.showTopNote;

  const footerRender = showFooter && styles.footer
    ? (pageNumber: number, totalPages: number) => (
        <Text style={styles.footer}>
          {formatTemplateString(tmpl.footer, {
            NAME: resume.personal.fullName,
            PAGE_NUMBER: String(pageNumber),
            TOTAL_PAGES: String(totalPages),
            CURRENT_DATE: new Date().toLocaleDateString(),
          })}
        </Text>
      )
    : undefined;

  return (
    <Document>
      <Page size={pageKey} style={styles.page} wrap>
        {/* Top Note (page 1 only) */}
        {showTopNote && styles.topNote && (
          <Text style={styles.topNote}>
            {formatTemplateString(tmpl.topNote, {
              NAME: resume.personal.fullName,
              CURRENT_DATE: new Date().toLocaleDateString(),
            })}
          </Text>
        )}

        {/* Header (page 1 only, kept together) */}
        <View wrap={false}>
          <View style={styles.header}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{resume.personal.fullName}</Text>
            </View>
            {resume.personal.jobTitle && (
              <View style={styles.headlineRow}>
                <Text style={styles.headline}>{resume.personal.jobTitle}</Text>
              </View>
            )}
            <View style={styles.contactRow}>
              {resume.personal.details
                .filter((item) => item.visible !== false)
                .map((item, idx, arr) => (
                  <React.Fragment key={item.id}>
                    <View style={styles.contactItem}>
                      {renderPdfItem(item, styles as unknown as Record<string, Style | undefined>, colors, undefined, translations)}
                    </View>
                    {templateConfig.header.connections.separator && idx < arr.length - 1 && (
                      <Text style={{ color: colors.connections, fontSize: styles.connectorFontSize }}>
                        {templateConfig.header.connections.separator}
                      </Text>
                    )}
                  </React.Fragment>
                ))}
            </View>
          </View>
        </View>

        {/* Sections (each kept intact, flows across pages) */}
        {resume.sections
          .filter((s) => s.visible !== false)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle} minPresenceAhead={40}>
                {section.title.toUpperCase()}
              </Text>
              <View style={styles.sectionContent}>
                {renderSectionContent(section.content, styles, colors, translations)}
              </View>
            </View>
          ))}

        {/* Footer (fixed, appears on every page) */}
        {footerRender && (
          <Text
            style={styles.footer}
            fixed
            render={({ pageNumber, totalPages }) =>
              footerRender(pageNumber, totalPages)
            }
          />
        )}
      </Page>
    </Document>
  );
};
