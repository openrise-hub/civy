import type { TemplateConfig } from "@/types/template";

export const darkTemplate: TemplateConfig = {
  theme: "dark",

  page: {
    size: "a4",
    topMargin: "1.8cm",
    bottomMargin: "1.8cm",
    leftMargin: "2cm",
    rightMargin: "2cm",
    showFooter: false,
    showTopNote: false,
  },

  colors: {
    body: "rgb(226, 232, 240)",
    name: "rgb(147, 197, 253)",
    headline: "rgb(203, 213, 225)",
    connections: "rgb(148, 163, 184)",
    sectionTitles: "rgb(147, 197, 253)",
    links: "rgb(96, 165, 250)",
    footer: "rgb(100, 116, 139)",
    topNote: "rgb(100, 116, 139)",
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
      name: "20pt",
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
    spaceBelowHeadline: "0.15cm",
    spaceBelowConnections: "0.35cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "·",
      spaceBetweenConnections: "0.4cm",
    },
  },

  sectionTitles: {
    type: "with_full_line",
    lineThickness: "1pt",
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
