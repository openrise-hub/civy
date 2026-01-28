import type { PdfTemplateConfig } from '../../engine/PdfRenderer';

export const modernPdfConfig: PdfTemplateConfig = {
  name: 'Modern',
  styles: {
    sectionTitle: {
      fontSize: 10,
      textTransform: 'uppercase',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      marginBottom: 12,
      paddingBottom: 4,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    jobTitle: {
      fontSize: 14,
      marginBottom: 8,
    },
    contactRow: {
      justifyContent: 'center',
    }
  }
};
