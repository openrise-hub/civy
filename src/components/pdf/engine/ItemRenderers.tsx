import React from 'react';
import { Text, View, Link } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import type { TemplateConfig } from '@/types/template';
import {
  isStringItem,
  isDateRangeItem,
  isLinkItem,
  isRatingItem,
  isImageItem,
  isSeparatorItem,
  isTagsItem,
  formatDateRange
} from '@/lib/resume-helpers';
import type {
  Item,
} from '@/types/resume';

export interface PdfTranslations {
  present: string;
  phone: string;
  email: string;
  image: string;
  location: string;
  website: string;
  [key: string]: string;
}

type PdfStyles = Record<string, Style | undefined>;

function getConnectorFontSize(styles: PdfStyles): number | undefined {
  return (styles as Record<string, unknown>).connectorFontSize as number | undefined;
}

function getLinkDecoration(styles: PdfStyles): 'underline' | 'none' {
  const val = (styles as Record<string, unknown>).linkDecoration;
  return val === 'none' ? 'none' : 'underline';
}
type PdfColors = TemplateConfig['colors'];

export type ItemRenderer = (
  item: Item,
  styles: PdfStyles,
  colors: PdfColors,
  customRenderers?: Record<string, ItemRenderer>,
  translations?: PdfTranslations
) => React.ReactNode;

// --- Renderers ---

const stringItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, translations) => {
  if (!isStringItem(item)) return null;

  const connFontSize = getConnectorFontSize(styles);

  switch (item.type) {
    case 'heading':
      return (
        <Text style={[styles.entryHeading || {}, { fontWeight: 'bold' }]}>
          {item.value}
        </Text>
      );

    case 'sub-heading':
      return (
        <Text style={[styles.headline || {}, { color: colors.headline }]}>
          {item.value}
        </Text>
      );

    case 'description':
      return (
        <Text style={{ color: colors.body, fontSize: styles.page?.fontSize || 12 }}>
          {item.value}
        </Text>
      );

    case 'location':
      return (
        <Text style={{ color: colors.connections, fontSize: connFontSize }}>
          {translations?.location || 'Location'}: {item.value}
        </Text>
      );

    case 'phone':
      return (
        <Text style={{ color: colors.connections, fontSize: connFontSize }}>
          {translations?.phone || 'Phone'}: {item.value}
        </Text>
      );

    case 'email':
      return (
        <Text style={{ color: colors.connections, fontSize: connFontSize }}>
          {translations?.email || 'Email'}: {item.value}
        </Text>
      );

    default:
      return <Text style={{ color: colors.body }}>{(item as { value: string }).value}</Text>;
  }
};

const dateRangeItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, translations) => {
  if (!isDateRangeItem(item)) return null;

  const formatted = formatDateRange(item.value, (key) => translations?.[key] || "Present");

  return (
    <Text style={{ fontStyle: 'italic', color: colors.connections, fontSize: getConnectorFontSize(styles) }}>
      {formatted}
    </Text>
  );
};

const linkItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, _translations) => {
  if (!isLinkItem(item)) return null;

  return (
    <Link
      src={item.value.url}
      style={{ color: colors.links, textDecoration: getLinkDecoration(styles) }}
    >
      {item.value.label || item.value.url}
    </Link>
  );
};

const ratingItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, _translations) => {
  if (!isRatingItem(item)) return null;

  const { label, score, max, display } = item.value;
  const accent = colors.sectionTitles || colors.name || '#2563eb';

  const Row = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.ratingRow as Style]}>{children}</View>
  );

  switch (display) {
    case 'stars':
      return (
        <Row>
          <Text style={[styles.ratingLabel as Style]}>{label}</Text>
          <Text style={{ color: accent, fontSize: 10 }}>
            {'★'.repeat(score)}{'☆'.repeat(max - score)}
          </Text>
        </Row>
      );

    case 'dots':
      return (
        <Row>
          <Text style={[styles.ratingLabel as Style]}>{label}</Text>
          <View style={[styles.dotsContainer as Style]}>
            {Array.from({ length: max }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.dot as Style,
                  { backgroundColor: i < score ? accent : '#e5e7eb' }
                ]}
              />
            ))}
          </View>
        </Row>
      );

    case 'bar':
      return (
        <Row>
          <Text style={[styles.ratingLabel as Style]}>{label}</Text>
          <View style={[styles.barContainer as Style]}>
            <View style={[
              styles.barFill as Style,
              { width: `${(score / max) * 100}%`, backgroundColor: accent }
            ]} />
          </View>
        </Row>
      );

    default:
      return (
        <Row>
          <Text style={[styles.ratingLabel as Style]}>{label}</Text>
          <Text>{score}/{max}</Text>
        </Row>
      );
  }
};

const imageItemRenderer: ItemRenderer = (item, _styles, colors, _customRenderers, translations) => {
  if (!isImageItem(item)) return null;

  return (
    <View style={{ alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ marginBottom: 4, fontSize: 10, color: colors.connections }}>
        {'📷'} {translations?.image || 'Image'}: {item.value.alt || 'Untitled'}
      </Text>
      <Text style={{ color: colors.body, fontStyle: 'italic', fontSize: 8 }}>
        {item.value.url}
      </Text>
    </View>
  );
};

const separatorItemRenderer: ItemRenderer = (_item, _styles, _colors) => (
  <View style={{ height: 1, backgroundColor: '#d1d5db', marginVertical: 8 }} />
);

const tagsItemRenderer: ItemRenderer = (item, _styles, colors) => {
  if (!isTagsItem(item)) return null;
  const { name, items: tagItems, display } = item.value;
  const bgColor = '#e5e7eb';
  const accent = colors.sectionTitles || colors.name || '#2563eb';

  const renderChips = (extra: object = {}) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      {tagItems.map((tag, i) => (
        <Text key={i} style={{ ...extra, fontSize: 10 }}>{tag}</Text>
      ))}
    </View>
  );

  let body: React.ReactNode;
  switch (display) {
    case 'sep':
      body = <Text style={{ fontSize: 12, color: colors.body }}>{tagItems.join(' \u2022 ')}</Text>;
      break;
    case 'dot':
      body = (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {tagItems.map((tag, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: accent }} />
              <Text style={{ fontSize: 12, color: colors.body }}>{tag}</Text>
            </View>
          ))}
        </View>
      );
      break;
    case 'block':
      body = (
        <View style={{ gap: 2 }}>
          {tagItems.map((tag, i) => (
            <Text key={i} style={{ backgroundColor: bgColor, color: colors.body, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 10 }}>{tag}</Text>
          ))}
        </View>
      );
      break;
    case 'compact':
      body = (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
          {tagItems.map((tag, i) => (
            <Text key={i} style={{ fontSize: 9, color: colors.body }}>{tag}{i < tagItems.length - 1 ? ',' : ''}</Text>
          ))}
        </View>
      );
      break;
    case 'outline':
      body = renderChips({ border: `1px solid ${accent}`, color: accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 });
      break;
    case 'soft':
      body = renderChips({ backgroundColor: `${accent}18`, color: accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 });
      break;
    case 'badge':
      body = renderChips({ backgroundColor: bgColor, color: colors.body, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 });
      break;
    case 'pill':
      body = renderChips({ backgroundColor: bgColor, color: colors.body, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 });
      break;
    default:
      body = <Text style={{ fontSize: 12, color: colors.body }}>{tagItems.join(', ')}</Text>;
  }

  return (
    <View style={{ marginBottom: 4 }}>
      {name ? <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 2, color: colors.body }}>{name}</Text> : null}
      {body}
    </View>
  );
};

export const baseItemRenderers: Record<string, ItemRenderer> = {
  heading: stringItemRenderer,
  'sub-heading': stringItemRenderer,
  description: stringItemRenderer,
  location: stringItemRenderer,
  phone: stringItemRenderer,
  email: stringItemRenderer,
  'date-range': dateRangeItemRenderer,
  link: linkItemRenderer,
  rating: ratingItemRenderer,
  image: imageItemRenderer,
  separator: separatorItemRenderer,
  tags: tagsItemRenderer,
};

export const renderPdfItem = (
  item: Item,
  styles: PdfStyles,
  colors: PdfColors,
  customRenderers?: Record<string, ItemRenderer>,
  translations?: PdfTranslations
): React.ReactNode => {
  const renderer = customRenderers?.[item.type] || baseItemRenderers[item.type];
  if (!renderer) return null;
  return renderer(item, styles, colors, customRenderers, translations);
};
