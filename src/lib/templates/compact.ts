import type { TemplateConfig } from "@/types/template";

export const compactTemplate: TemplateConfig = {
  theme: "compact",

  page: {
    size: "a4",
    topMargin: "1.2cm",
    bottomMargin: "1.2cm",
    leftMargin: "1.5cm",
    rightMargin: "1.5cm",
    showFooter: false,
    showTopNote: false,
  },

  colors: {
    body: "rgb(24, 24, 27)",
    name: "rgb(24, 24, 27)",
    headline: "rgb(82, 82, 91)",
    connections: "rgb(113, 113, 122)",
    sectionTitles: "rgb(24, 24, 27)",
    links: "rgb(37, 99, 235)",
    footer: "rgb(161, 161, 170)",
    topNote: "rgb(161, 161, 170)",
  },

  typography: {
    lineSpacing: "1.4",
    alignment: "justified",
    dateAndLocationColumnAlignment: "right",
    fontFamily: {
      body: "Inter",
      name: "Inter",
      headline: "Inter",
      connections: "Inter",
      sectionTitles: "Inter",
    },
    fontSize: {
      body: "8pt",
      name: "14pt",
      entryHeading: "9pt",
      headline: "10pt",
      connections: "7pt",
      sectionTitles: "9pt",
    },
    smallCaps: {
      name: false,
      headline: false,
      connections: false,
      sectionTitles: true,
    },
    bold: {
      name: true,
      entryHeading: true,
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
    alignment: "left",
    photoWidth: "2.5cm",
    photoPosition: "left",
    photoSpaceLeft: "0.3cm",
    photoSpaceRight: "0.3cm",
    spaceBelowName: "0.05cm",
    spaceBelowHeadline: "0.05cm",
    spaceBelowConnections: "0.15cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "|",
      spaceBetweenConnections: "0.3cm",
    },
  },

  sectionTitles: {
    type: "with_partial_line",
    lineThickness: "1pt",
    spaceAbove: "0.3cm",
    spaceBelow: "0.15cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "0.5em",
    spaceBetweenTextBasedEntries: "0.15em",
    showTimeSpansIn: ["experience"],
  },

  entries: {
    dateAndLocationWidth: "3cm",
    sideSpace: "0.1cm",
    spaceBetweenColumns: "0.05cm",
    allowPageBreak: false,
    shortSecondRow: true,
    degreeWidth: "0.8cm",
    summary: {
      spaceAbove: "0cm",
      spaceLeft: "0cm",
    },
    highlights: {
      bullet: "•",
      nestedBullet: "•",
      spaceLeft: "0.1cm",
      spaceAbove: "0cm",
      spaceBetweenItems: "0.05em",
      spaceBetweenBulletAndText: "0.3em",
    },
  },

  templates: {
    footer: "NAME — PAGE_NUMBER / TOTAL_PAGES",
    topNote: "Last updated CURRENT_DATE",
    singleDate: "MON_ABBREVIATION YEAR",
    dateRange: "START_DATE – END_DATE",
    timeSpan: "HOW_MANY_YEARS y HOW_MANY_MONTHS m",
    oneLineEntry: { mainColumn: "**LABEL:** DETAILS" },
    educationEntry: {
      mainColumn: "**INSTITUTION**, AREA\nSUMMARY",
      degreeColumn: "**DEGREE**",
      dateAndLocationColumn: "DATE",
    },
    normalEntry: {
      mainColumn: "**NAME**\nSUMMARY\nHIGHLIGHTS",
      dateAndLocationColumn: "LOCATION\nDATE",
    },
    experienceEntry: {
      mainColumn: "**COMPANY**, POSITION\nSUMMARY\nHIGHLIGHTS",
      dateAndLocationColumn: "DATE",
    },
    publicationEntry: {
      mainColumn: "**TITLE**\nSUMMARY\nURL (JOURNAL)",
      dateAndLocationColumn: "DATE",
    },
  },
};
