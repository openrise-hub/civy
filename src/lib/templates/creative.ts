import type { TemplateConfig } from "@/types/template";

export const creativeTemplate: TemplateConfig = {
  theme: "creative",

  page: {
    size: "a4",
    topMargin: "2.5cm",
    bottomMargin: "2.5cm",
    leftMargin: "2.5cm",
    rightMargin: "2.5cm",
    showFooter: false,
    showTopNote: false,
  },

  colors: {
    body: "rgb(31, 41, 55)",
    name: "rgb(13, 148, 136)",
    headline: "rgb(20, 184, 166)",
    connections: "rgb(107, 114, 128)",
    sectionTitles: "rgb(13, 148, 136)",
    links: "rgb(13, 148, 136)",
    footer: "rgb(156, 163, 175)",
    topNote: "rgb(156, 163, 175)",
  },

  typography: {
    lineSpacing: "1.6",
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
      name: "18pt",
      entryHeading: "13pt",
      headline: "13pt",
      connections: "9pt",
      sectionTitles: "15pt",
    },
    smallCaps: {
      name: true,
      headline: false,
      connections: false,
      sectionTitles: true,
    },
    bold: {
      name: false,
      entryHeading: false,
      headline: false,
      connections: false,
      sectionTitles: false,
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
    spaceBelowName: "0.1cm",
    spaceBelowHeadline: "0.1cm",
    spaceBelowConnections: "0.3cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "\u2022",
      spaceBetweenConnections: "0.5cm",
    },
  },

  sectionTitles: {
    type: "centered_with_partial_line",
    lineThickness: "1pt",
    spaceAbove: "0.5cm",
    spaceBelow: "0.3cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "1.4em",
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
      bullet: "\u25c6",
      nestedBullet: "\u25c6",
      spaceLeft: "0.15cm",
      spaceAbove: "0cm",
      spaceBetweenItems: "0.1em",
      spaceBetweenBulletAndText: "0.5em",
    },
  },

  templates: {
    footer: "NAME -- PAGE_NUMBER / TOTAL_PAGES",
    topNote: "Last updated CURRENT_DATE",
    singleDate: "MONTH_ABBREVIATION YEAR",
    dateRange: "START_DATE -- END_DATE",
    timeSpan: "HOW_MANY_YEARS years HOW_MANY_MONTHS months",
    oneLineEntry: { mainColumn: "**LABEL:** DETAILS" },
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
