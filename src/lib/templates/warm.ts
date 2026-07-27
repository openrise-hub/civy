import type { TemplateConfig } from "@/types/template";

export const warmTemplate: TemplateConfig = {
  theme: "warm",

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
    body: "rgb(68, 64, 60)",
    name: "rgb(180, 83, 9)",
    headline: "rgb(120, 113, 108)",
    connections: "rgb(120, 113, 108)",
    sectionTitles: "rgb(180, 83, 9)",
    links: "rgb(180, 83, 9)",
    footer: "rgb(168, 162, 158)",
    topNote: "rgb(168, 162, 158)",
  },

  typography: {
    lineSpacing: "1.7",
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
      entryHeading: "12pt",
      headline: "13pt",
      connections: "9pt",
      sectionTitles: "13pt",
    },
    smallCaps: {
      name: false,
      headline: false,
      connections: false,
      sectionTitles: true,
    },
    bold: {
      name: true,
      entryHeading: false,
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
    spaceBelowName: "0.15cm",
    spaceBelowHeadline: "0.1cm",
    spaceBelowConnections: "0.35cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "—",
      spaceBetweenConnections: "0.5cm",
    },
  },

  sectionTitles: {
    type: "centered_with_partial_line",
    lineThickness: "2pt",
    spaceAbove: "0.5cm",
    spaceBelow: "0.3cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "1em",
    spaceBetweenTextBasedEntries: "0.25em",
    showTimeSpansIn: ["experience"],
  },

  entries: {
    dateAndLocationWidth: "4cm",
    sideSpace: "0.2cm",
    spaceBetweenColumns: "0.15cm",
    allowPageBreak: false,
    shortSecondRow: true,
    degreeWidth: "1cm",
    summary: {
      spaceAbove: "0cm",
      spaceLeft: "0cm",
    },
    highlights: {
      bullet: "—",
      nestedBullet: "•",
      spaceLeft: "0.2cm",
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
