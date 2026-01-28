import { StyleSheet } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';

export interface ColorScheme {
  background: string;
  text: string;
  accents: string[];
}

export interface BasePdfStyles {
  page: Style;
  name: Style;
  jobTitle: Style;
  header: Style;
  contactRow: Style;
  contactItem: Style;
  section: Style;
  sectionTitle: Style;
  sectionContent: Style;
  listItem: Style;
  bulletRow: Style;
  ratingRow: Style;
  ratingLabel: Style;
  barContainer: Style;
  barFill: Style;
  dotsContainer: Style;
  dot: Style;
  grid: Style;
  gridRow: Style;
  gridItem: Style;
  inline: Style;
}

export const basePdfStyles: BasePdfStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.4,
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
  },
  sectionContent: {
    marginTop: 4,
  },
  listItem: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 11,
    marginRight: 8,
  },
  barContainer: {
    width: 60,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gridItem: {
    flex: 1,
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});