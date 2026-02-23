import React from 'react';
import { Text, View, Link } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { 
  isStringItem, 
  isDateRangeItem, 
  isLinkItem, 
  isRatingItem, 
  isImageItem, 
  isSeparatorItem,
  formatDateRange 
} from '@/lib/resume-helpers';
import { 
  Item, 
  StringItem, 
  DateRangeItem, 
  LinkItem, 
  RatingItem, 
  ImageItem, 
  SeparatorItem 
} from '@/types/resume';

import { 
  ColorScheme, 
  BasePdfStyles 
} from './PdfStyles';

// i18n Interface
export interface PdfTranslations {
  present: string;
  phone: string;
  email: string;
  image: string;
  location: string;
  website: string;
  [key: string]: string;
}

export type ItemRenderer = (
  item: Item, 
  styles: BasePdfStyles, 
  colors: ColorScheme, 
  customRenderers?: Record<string, ItemRenderer>,
  overrides?: Partial<BasePdfStyles>,
  translations?: PdfTranslations
) => React.ReactNode;

// Helper to merge item styles
const getStyle = (base: Style, override: Style | undefined, extra?: Style): Style[] => {
  return [base, override, extra].filter(Boolean) as Style[];
};

export const baseStringItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, overrides, _translations) => {
  if (!isStringItem(item)) return null;
  
  const baseStyle = { color: colors.text };
  
  switch (item.type) {
    case 'heading':
      return (
        <Text style={getStyle(styles.name, overrides?.name, { ...baseStyle, fontSize: 16, fontWeight: 'bold' })}>
          {item.value}
        </Text>
      );
      
    case 'sub-heading':
      return (
        <Text style={getStyle(styles.jobTitle, overrides?.jobTitle, { ...baseStyle, color: colors.accents[1], fontSize: 14 })}>
          {item.value}
        </Text>
      );
      
    case 'text':
      return (
        <Text style={[baseStyle, { fontSize: 12 }]}>
          {item.value}
        </Text>
      );
      
    case 'bullet':
      return (
        <View style={getStyle(styles.bulletRow, overrides?.bulletRow)}>
          <Text style={{ color: colors.accents[0], marginRight: 4 }}>•</Text>
          <Text style={[baseStyle, { flex: 1 }]}>
            {item.value}
          </Text>
        </View>
      );
      
    case 'date':
      return (
        <Text style={[baseStyle, { fontStyle: 'italic', color: colors.accents[3] }]}>
          {item.value}
        </Text>
      );
      
    case 'location':
      return (
        <Text style={[baseStyle, { color: colors.accents[3] }]}>
          📍 {item.value}
        </Text>
      );
      
    case 'phone':
      return (
        <Text style={[baseStyle, { color: colors.accents[3] }]}>
          📱 {item.value}
        </Text>
      );
      
    case 'email':
      return (
        <Text style={[baseStyle, { color: colors.accents[3] }]}>
          📧 {item.value}
        </Text>
      );
      
    case 'tag':
      return (
        <Text style={[baseStyle, { backgroundColor: colors.accents[2], color: colors.text, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 10 }]}>
          {item.value}
        </Text>
      );
      
    default:
      return (
        <Text style={baseStyle}>
          {item.value}
        </Text>
      );
  }
};

export const baseDateRangeItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, overrides, translations) => {
  if (!isDateRangeItem(item)) return null;

  const formatted = formatDateRange(item.value, (key) => translations?.[key] || "Present");

  return (
    <Text style={getStyle(styles.name, overrides?.name, { fontStyle: 'italic', color: colors.accents[3] })}>
      {formatted}
    </Text>
  );
};

export const baseLinkItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, overrides, _translations) => {
  if (!isLinkItem(item)) return null;
  
  return (
    <Link 
      src={item.value.url}
      style={getStyle(styles.name, overrides?.name, { color: colors.accents[1], textDecoration: 'underline' })}
    >
      {item.value.label || item.value.url}
    </Link>
  );
};

export const baseRatingItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, overrides, _translations) => {
  if (!isRatingItem(item)) return null;
  
  const { label, score, max, display } = item.value;
  
  switch (display) {
    case 'stars':
      return (
        <View style={getStyle(styles.ratingRow, overrides?.ratingRow)}>
          <Text style={getStyle(styles.ratingLabel, overrides?.ratingLabel)}>{label}</Text>
          <Text style={{ color: colors.accents[0], fontSize: 10 }}>
            {'★'.repeat(score)}{'☆'.repeat(max - score)}
          </Text>
        </View>
      );
      
    case 'dots':
      return (
        <View style={getStyle(styles.ratingRow, overrides?.ratingRow)}>
          <Text style={getStyle(styles.ratingLabel, overrides?.ratingLabel)}>{label}</Text>
          <View style={getStyle(styles.dotsContainer, overrides?.dotsContainer)}>
            {Array.from({ length: max }, (_, i) => (
              <View 
                key={i}
                style={getStyle(styles.dot, overrides?.dot, { backgroundColor: i < score ? colors.accents[0] : (colors.accents[2] || '#e5e7eb') })}
               />
            ))}
          </View>
        </View>
      );
      
    case 'bar':
      return (
        <View style={getStyle(styles.ratingRow, overrides?.ratingRow)}>
          <Text style={getStyle(styles.ratingLabel, overrides?.ratingLabel)}>{label}</Text>
          <View style={getStyle(styles.barContainer, overrides?.barContainer)}>
            <View style={getStyle(
              styles.barFill, 
              overrides?.barFill, 
              { width: `${(score / max) * 100}%`, backgroundColor: colors.accents[0] }
            )} />
          </View>
        </View>
      );
      
    default:
      return (
        <View style={getStyle(styles.ratingRow, overrides?.ratingRow)}>
          <Text style={getStyle(styles.ratingLabel, overrides?.ratingLabel)}>{label}</Text>
          <Text style={getStyle(styles.ratingLabel, overrides?.ratingLabel)}>
            {score}/{max}
          </Text>
        </View>
      );
  }
};

export const baseImageItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, overrides, translations) => {
  if (!isImageItem(item)) return null;
  
  return (
    <View style={{ alignItems: 'center', marginBottom: 8 }}>
      <Text style={getStyle(styles.name, overrides?.name, { marginBottom: 4, fontSize: 10, color: colors.accents[3] })}>
        📷 {translations?.image || 'Image'}: {item.value.alt || 'Untitled'}
      </Text>
      <Text style={{ color: colors.text, fontStyle: 'italic', fontSize: 8 }}>
        {item.value.url}
      </Text>
    </View>
  );
};

export const baseSeparatorItemRenderer: ItemRenderer = (item, styles, colors, _customRenderers, _overrides, _translations) => {
  if (!isSeparatorItem(item)) return null;
  
  return (
    <View style={{ 
      height: 1, 
      backgroundColor: colors.accents[2], 
      marginVertical: 8 
    }} />
  );
};

export const baseItemRenderers: Record<string, ItemRenderer> = {
  heading: baseStringItemRenderer,
  'sub-heading': baseStringItemRenderer,
  text: baseStringItemRenderer,
  bullet: baseStringItemRenderer,
  number: baseStringItemRenderer,
  date: baseStringItemRenderer,
  location: baseStringItemRenderer,
  phone: baseStringItemRenderer,
  email: baseStringItemRenderer,
  tag: baseStringItemRenderer,
  'date-range': baseDateRangeItemRenderer,
  link: baseLinkItemRenderer,
  social: baseLinkItemRenderer,
  rating: baseRatingItemRenderer,
  image: baseImageItemRenderer,
  separator: baseSeparatorItemRenderer,
};

export const renderPdfItem = (
  item: Item, 
  styles: BasePdfStyles, 
  colors: ColorScheme,
  customRenderers?: Record<string, ItemRenderer>,
  overrides?: Partial<BasePdfStyles>,
  translations?: PdfTranslations
): React.ReactNode => {
  const renderer = customRenderers?.[item.type] || baseItemRenderers[item.type];
  if (!renderer) return null;
  return renderer(item, styles, colors, customRenderers, overrides, translations);
};