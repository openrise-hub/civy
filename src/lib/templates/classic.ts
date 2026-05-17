import type { TemplateConfig } from "@/types/template";

export const classicTemplate: TemplateConfig = {
  theme: "classic",

  page: {
    size: "us-letter",
    topMargin: "0.7in",
    bottomMargin: "0.7in",
    leftMargin: "0.7in",
    rightMargin: "0.7in",
    showFooter: true,
    showTopNote: true,
  },

  colors: {
    body: "rgb(0, 0, 0)",
    name: "rgb(0, 79, 144)",
    headline: "rgb(0, 79, 144)",
    connections: "rgb(0, 79, 144)",
    sectionTitles: "rgb(0, 79, 144)",
    links: "rgb(0, 79, 144)",
    footer: "rgb(128, 128, 128)",
    topNote: "rgb(128, 128, 128)",
  },

  typography: {
    lineSpacing: "0.6em",
    alignment: "justified",
    dateAndLocationColumnAlignment: "right",
    fontFamily: {
      body: "Source Sans 3",
      name: "Source Sans 3",
      headline: "Source Sans 3",
      connections: "Source Sans 3",
      sectionTitles: "Source Sans 3",
    },
    fontSize: {
      body: "10pt",
      name: "30pt",
      headline: "10pt",
      connections: "10pt",
      sectionTitles: "1.4em",
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
    underline: false,
    showExternalLinkIcon: false,
  },

  header: {
    alignment: "center",
    photoWidth: "3.5cm",
    photoPosition: "left",
    photoSpaceLeft: "0.4cm",
    photoSpaceRight: "0.4cm",
    spaceBelowName: "0.7cm",
    spaceBelowHeadline: "0.7cm",
    spaceBelowConnections: "0.7cm",
    connections: {
      phoneNumberFormat: "national",
      hyperlink: true,
      showIcons: true,
      displayUrlsInsteadOfUsernames: false,
      separator: "",
      spaceBetweenConnections: "0.5cm",
    },
  },

  sectionTitles: {
    type: "with_partial_line",
    lineThickness: "0.5pt",
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
      spaceBetweenItems: "0cm",
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
