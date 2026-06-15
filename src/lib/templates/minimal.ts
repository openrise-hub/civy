import type { TemplateConfig } from "@/types/template";

export const minimalTemplate: TemplateConfig = {
  theme: "minimal",

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
    name: "rgb(17, 24, 39)",
    headline: "rgb(75, 85, 99)",
    connections: "rgb(107, 114, 128)",
    sectionTitles: "rgb(17, 24, 39)",
    links: "rgb(37, 99, 235)",
    footer: "rgb(156, 163, 175)",
    topNote: "rgb(156, 163, 175)",
  },

  typography: {
    lineSpacing: "0.6em",
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
      name: "22pt",
      headline: "12pt",
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
      sectionTitles: false,
    },
  },

  links: {
    underline: true,
    showExternalLinkIcon: false,
  },

  header: {
    alignment: "left",
    photoWidth: "3.5cm",
    photoPosition: "left",
    photoSpaceLeft: "0.4cm",
    photoSpaceRight: "0.4cm",
    spaceBelowName: "0.3cm",
    spaceBelowHeadline: "0.2cm",
    spaceBelowConnections: "0.4cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "",
      spaceBetweenConnections: "0.4cm",
    },
  },

  sectionTitles: {
    type: "without_line",
    lineThickness: "1pt",
    spaceAbove: "0.4cm",
    spaceBelow: "0.2cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "1em",
    spaceBetweenTextBasedEntries: "0.2em",
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
      bullet: "\u2022",
      nestedBullet: "\u2022",
      spaceLeft: "0.15cm",
      spaceAbove: "0cm",
      spaceBetweenItems: "0.05em",
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
