import type { TemplateConfig } from "@/types/template";

export const modernTemplate: TemplateConfig = {
  theme: "modern",

  page: {
    size: "a4",
    topMargin: "2cm",
    bottomMargin: "2cm",
    leftMargin: "2cm",
    rightMargin: "2cm",
    showFooter: false,
    showTopNote: false,
  },

  colors: {
    body: "rgb(31, 41, 55)",
    name: "rgb(37, 99, 235)",
    headline: "rgb(59, 130, 246)",
    connections: "rgb(107, 114, 128)",
    sectionTitles: "rgb(37, 99, 235)",
    links: "rgb(37, 99, 235)",
    footer: "rgb(156, 163, 175)",
    topNote: "rgb(156, 163, 175)",
  },

  typography: {
    lineSpacing: "1.5",
    alignment: "left",
    dateAndLocationColumnAlignment: "right",
    fontFamily: {
      body: "Inter",
      name: "Inter",
      headline: "Inter",
      connections: "Inter",
      sectionTitles: "Inter",
    },
    fontSize: {
      body: "10pt",
      name: "24pt",
      headline: "14pt",
      connections: "9pt",
      sectionTitles: "10pt",
    },
    smallCaps: {
      name: false,
      headline: false,
      connections: false,
      sectionTitles: false,
    },
    bold: {
      name: true,
      headline: false,
      connections: false,
      sectionTitles: true,
    },
  },

  links: {
    underline: true,
    showExternalLinkIcon: false,
  },

  header: {
    alignment: "center",
    photoWidth: "3.5cm",
    photoPosition: "left",
    photoSpaceLeft: "0.4cm",
    photoSpaceRight: "0.4cm",
    spaceBelowName: "0.4cm",
    spaceBelowHeadline: "0.3cm",
    spaceBelowConnections: "0.5cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "•",
      spaceBetweenConnections: "0.5cm",
    },
  },

  sectionTitles: {
    type: "with_partial_line",
    lineThickness: "2pt",
    spaceAbove: "0.5cm",
    spaceBelow: "0.3cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "1.2em",
    spaceBetweenTextBasedEntries: "0.3em",
    showTimeSpansIn: ["experience"],
  },

  entries: {
    dateAndLocationWidth: "4.15cm",
    sideSpace: "0.2cm",
    spaceBetweenColumns: "0.1cm",
    allowPageBreak: false,
    shortSecondRow: true,
    degreeWidth: "1cm",
    summary: {
      spaceAbove: "0cm",
      spaceLeft: "0cm",
    },
    highlights: {
      bullet: "•",
      nestedBullet: "•",
      spaceLeft: "0.15cm",
      spaceAbove: "0cm",
      spaceBetweenItems: "0.1em",
      spaceBetweenBulletAndText: "0.5em",
    },
  },

  templates: {
    footer: "NAME — PAGE_NUMBER / TOTAL_PAGES",
    topNote: "Last updated CURRENT_DATE",
    singleDate: "MONTH_ABBREVIATION YEAR",
    dateRange: "START_DATE – END_DATE",
    timeSpan: "HOW_MANY_YEARS years HOW_MANY_MONTHS months",
    oneLineEntry: {
      mainColumn: "**LABEL:** DETAILS",
    },
    educationEntry: {
      mainColumn: "**INSTITUTION**, AREA\nSUMMARY\nHIGHLIGHTS",
      degreeColumn: "**DEGREE**",
      dateAndLocationColumn: "LOCATION\nDATE",
    },
    normalEntry: {
      mainColumn: "**NAME**\nSUMMARY\nHIGHLIGHTS",
      dateAndLocationColumn: "LOCATION\nDATE",
    },
    experienceEntry: {
      mainColumn: "**COMPANY**, POSITION\nSUMMARY\nHIGHLIGHTS",
      dateAndLocationColumn: "LOCATION\nDATE",
    },
    publicationEntry: {
      mainColumn: "**TITLE**\nSUMMARY\nAUTHORS\nURL (JOURNAL)",
      dateAndLocationColumn: "DATE",
    },
  },
};
