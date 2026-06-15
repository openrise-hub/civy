import type { TemplateConfig } from "@/types/template";

export const executiveTemplate: TemplateConfig = {
  theme: "executive",

  page: {
    size: "a4",
    topMargin: "3cm",
    bottomMargin: "3cm",
    leftMargin: "3cm",
    rightMargin: "3cm",
    showFooter: false,
    showTopNote: false,
  },

  colors: {
    body: "rgb(55, 65, 81)",
    name: "rgb(17, 24, 39)",
    headline: "rgb(75, 85, 99)",
    connections: "rgb(107, 114, 128)",
    sectionTitles: "rgb(17, 24, 39)",
    links: "rgb(37, 99, 235)",
    footer: "rgb(156, 163, 175)",
    topNote: "rgb(156, 163, 175)",
  },

  typography: {
    lineSpacing: "1.8",
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
      body: "11pt",
      name: "20pt",
      entryHeading: "13pt",
      headline: "15pt",
      connections: "10pt",
      sectionTitles: "16pt",
    },
    smallCaps: {
      name: false,
      headline: false,
      connections: false,
      sectionTitles: false,
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
    spaceBelowConnections: "0.4cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: false,
      displayUrlsInsteadOfUsernames: false,
      separator: "\u2022",
      spaceBetweenConnections: "0.6cm",
    },
  },

  sectionTitles: {
    type: "centered_without_line",
    lineThickness: "0pt",
    spaceAbove: "0.8cm",
    spaceBelow: "0.4cm",
  },

  sections: {
    allowPageBreak: true,
    spaceBetweenRegularEntries: "1.6em",
    spaceBetweenTextBasedEntries: "0.4em",
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
      spaceBetweenItems: "0.15em",
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
