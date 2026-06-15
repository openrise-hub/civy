import type { TemplateConfig } from "@/types/template";

export const academicTemplate: TemplateConfig = {
  theme: "academic",

  page: {
    size: "us-letter",
    topMargin: "1.8cm",
    bottomMargin: "1.8cm",
    leftMargin: "1.8cm",
    rightMargin: "1.8cm",
    showFooter: true,
    showTopNote: false,
  },

  colors: {
    body: "rgb(31, 41, 55)",
    name: "rgb(17, 24, 39)",
    headline: "rgb(55, 65, 81)",
    connections: "rgb(107, 114, 128)",
    sectionTitles: "rgb(17, 24, 39)",
    links: "rgb(37, 99, 235)",
    footer: "rgb(156, 163, 175)",
    topNote: "rgb(156, 163, 175)",
  },

  typography: {
    lineSpacing: "0.3em",
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
      body: "9pt",
      name: "20pt",
      headline: "11pt",
      connections: "8pt",
      sectionTitles: "10pt",
    },
    smallCaps: {
      name: false,
      headline: false,
      connections: false,
      sectionTitles: true,
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
    spaceBelowName: "0.2cm",
    spaceBelowHeadline: "0.2cm",
    spaceBelowConnections: "0.3cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "\u2022",
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
    spaceBetweenRegularEntries: "0.8em",
    spaceBetweenTextBasedEntries: "0.15em",
    showTimeSpansIn: ["experience"],
  },

  entries: {
    dateAndLocationWidth: "5cm",
    sideSpace: "0.1cm",
    spaceBetweenColumns: "0.05cm",
    allowPageBreak: false,
    shortSecondRow: true,
    degreeWidth: "1cm",
    summary: {
      spaceAbove: "0cm",
      spaceLeft: "0cm",
    },
    highlights: {
      bullet: "\u2022",
      nestedBullet: "\u2022",
      spaceLeft: "0.1cm",
      spaceAbove: "0cm",
      spaceBetweenItems: "0.02em",
      spaceBetweenBulletAndText: "0.4em",
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
