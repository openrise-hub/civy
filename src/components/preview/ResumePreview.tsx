"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Resume, Section } from "@/types/resume";
import type { TemplateConfig } from "@/types/template";
import { resolveTemplateConfig } from "@/lib/templates/resolver";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewSection } from "./PreviewSection";

interface ResumePreviewProps {
  resume: Resume;
  activeSectionId?: string | null;
  showGuides?: boolean;
}

const PAGE_SIZES: Record<string, { w: number; h: number }> = {
  "a4": { w: 595, h: 842 },
  "us-letter": { w: 612, h: 792 },
};

function getTemplateConfig(resume: Resume): TemplateConfig {
  if (resume.metadata.templateConfig) {
    return resolveTemplateConfig(
      resume.metadata.template || "modern",
      resume.metadata.templateConfig
    );
  }
  return resolveTemplateConfig(resume.metadata.template || "modern");
}

function replacePlaceholders(template: string, values: Record<string, string>): string {
  return template.replace(/\b([A-Z_]+)\b/g, (match) => values[match] || match);
}

function parseLineSpacing(val: string): string {
  const num = parseFloat(val);
  if (val.endsWith("em") || val.endsWith("pt")) return String(1 + num);
  return val;
}

function cssToPreviewPx(value: string): number {
  const num = parseFloat(value);
  if (value.endsWith("cm")) return num * 28.35;
  if (value.endsWith("in")) return num * 72;
  if (value.endsWith("mm")) return num * 2.835;
  if (value.endsWith("pt")) return num;
  return num;
}

function toCssFontSize(value: string): string {
  const num = parseFloat(value);
  if (value.endsWith("pt")) return `${num}px`;
  if (value.endsWith("em")) return value;
  return value;
}

export { cssToPreviewPx };

export function ResumePreview({ resume, activeSectionId, showGuides = false }: ResumePreviewProps) {
  const config = useMemo(
    () => getTemplateConfig(resume),
    [resume.metadata.template, resume.metadata.templateConfig]
  );
  const { colors, page, typography, templates: tmpl } = config;
  const showFooter = resume.metadata.showFooter ?? config.page.showFooter;
  const showTopNote = resume.metadata.showTopNote ?? config.page.showTopNote;

  const pageDims = PAGE_SIZES[page.size] || PAGE_SIZES.a4;

  const topMarginPx = cssToPreviewPx(page.topMargin);
  const bottomMarginPx = cssToPreviewPx(page.bottomMargin);
  const leftMarginPx = cssToPreviewPx(page.leftMargin);
  const rightMarginPx = cssToPreviewPx(page.rightMargin);
  const contentHeight = pageDims.h - topMarginPx - bottomMarginPx;
  const contentWidth = pageDims.w - leftMarginPx - rightMarginPx;

  const today = new Date().toLocaleDateString();
  const name = resume.personal.fullName;
  const topNoteText = replacePlaceholders(tmpl.topNote, { NAME: name, CURRENT_DATE: today });

  const makeFooterText = (page: number, total: number) =>
    replacePlaceholders(tmpl.footer, {
      NAME: name,
      PAGE_NUMBER: String(page),
      TOTAL_PAGES: String(total),
      CURRENT_DATE: today,
    });

  const visibleSections = useMemo(
    () => resume.sections.filter((s) => s.visible !== false),
    [resume.sections]
  );

  const [pageDistribution, setPageDistribution] = useState<Section[][]>([visibleSections]);
  const [prevSections, setPrevSections] = useState(visibleSections);
  const measureRef = useRef<HTMLDivElement>(null);

  if (visibleSections !== prevSections) {
    setPrevSections(visibleSections);
    setPageDistribution([visibleSections]);
  }

  useLayoutEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const sectionEls = container.querySelectorAll<HTMLElement>("[data-section-id]");
    if (sectionEls.length === 0) {
      setPageDistribution([[]]);
      return;
    }

    const heights = Array.from(sectionEls).map((el) => el.offsetHeight);
    const headerEl = container.querySelector<HTMLElement>("[data-header]");
    const topNoteEl = container.querySelector<HTMLElement>("[data-top-note]");
    const headerHeight =
      (headerEl?.offsetHeight || 0) + (topNoteEl?.offsetHeight || 0);

    const newPages: Section[][] = [[]];
    let currentHeight = headerHeight;

    for (let i = 0; i < visibleSections.length; i++) {
      const sectionHeight = heights[i] || 0;
      const pageIdx = newPages.length - 1;

      if (sectionHeight > contentHeight) {
        if (newPages[pageIdx].length > 0) {
          newPages.push([visibleSections[i]]);
        } else {
          newPages[pageIdx].push(visibleSections[i]);
        }
        if (i < visibleSections.length - 1) {
          newPages.push([]);
          currentHeight = 0;
        }
        continue;
      }

      if (
        newPages[pageIdx].length > 0 &&
        currentHeight + sectionHeight > contentHeight
      ) {
        newPages.push([visibleSections[i]]);
        currentHeight = sectionHeight;
      } else {
        newPages[pageIdx].push(visibleSections[i]);
        currentHeight += sectionHeight;
      }
    }

    const result = newPages.filter((p) => p.length > 0);
    const finalDist = result.length > 0 ? result : [[]];

    setPageDistribution((prev) => {
      if (
        prev.length === finalDist.length &&
        prev.every((p, i) => p.length === finalDist[i].length)
      ) {
        return prev;
      }
      return finalDist;
    });
  }, [visibleSections, config, pageDims, page, contentHeight]);

  const tallSectionIds = useMemo(() => {
    if (!measureRef.current) return new Set<string>();
    const ids = new Set<string>();
    measureRef.current
      .querySelectorAll<HTMLElement>("[data-section-id]")
      .forEach((el) => {
        if (el.offsetHeight > contentHeight) {
          const id = el.getAttribute("data-section-id");
          if (id) ids.add(id);
        }
      });
    return ids;
  }, [pageDistribution, contentHeight]);

  const textAlign = (
    typography.alignment === "justified" ? "justify" : typography.alignment
  ) as React.CSSProperties["textAlign"];

  const basePageStyle: React.CSSProperties = {
    width: `${pageDims.w}px`,
    margin: "16px auto 0 auto",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: typography.fontFamily.body,
    fontSize: toCssFontSize(typography.fontSize.body),
    lineHeight: parseLineSpacing(typography.lineSpacing),
    color: colors.body,
    boxSizing: "border-box" as const,
    textAlign,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 16 }}>
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "hidden",
          pointerEvents: "none",
          width: `${contentWidth}px`,
          fontFamily: typography.fontFamily.body,
          fontSize: toCssFontSize(typography.fontSize.body),
          lineHeight: parseLineSpacing(typography.lineSpacing),
          color: colors.body,
          textAlign,
        }}
      >
        {showTopNote && (
          <div
            data-top-note
            style={{
              fontSize: toCssFontSize(typography.fontSize.connections),
              color: colors.topNote,
              marginBottom: 12,
              fontFamily: typography.fontFamily.connections,
            }}
          >
            {topNoteText}
          </div>
        )}
        <div data-header>
          <PreviewHeader personal={resume.personal} config={config} />
        </div>
        {visibleSections.map((section) => (
          <div key={section.id} data-section-id={section.id}>
            <PreviewSection section={section} config={config} />
          </div>
        ))}
        {showFooter && (
          <div
            data-footer
            style={{
              textAlign: "center",
              fontSize: toCssFontSize(typography.fontSize.connections),
              color: colors.footer,
              fontFamily: typography.fontFamily.connections,
            }}
          >
            {makeFooterText(1, 1)}
          </div>
        )}
      </div>

      {pageDistribution.map((pageSections, pageIdx) => {
        const hasTallSection = pageSections.some((s) =>
          tallSectionIds.has(s.id)
        );

        return (
          <div
            key={pageIdx}
            style={{
              ...basePageStyle,
              ...(hasTallSection
                ? { minHeight: `${pageDims.h}px` }
                : { height: `${pageDims.h}px`, overflow: "hidden" as const }),
              paddingTop: `${topMarginPx}px`,
              paddingBottom: `${bottomMarginPx}px`,
              paddingLeft: `${leftMarginPx}px`,
              paddingRight: `${rightMarginPx}px`,
              position: "relative" as const,
            }}
          >
            {showGuides && (
              <div
                style={{
                  position: "absolute",
                  top: `${topMarginPx}px`,
                  left: `${leftMarginPx}px`,
                  right: `${rightMarginPx}px`,
                  bottom: `${bottomMarginPx}px`,
                  border: "1px dashed rgba(148, 163, 184, 0.5)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}
            {pageIdx === 0 && showTopNote && (
              <div
                style={{
                  fontSize: toCssFontSize(typography.fontSize.connections),
                  color: colors.topNote,
                  marginBottom: 12,
                  fontFamily: typography.fontFamily.connections,
                }}
              >
                {topNoteText}
              </div>
            )}

            {pageIdx === 0 && (
              <PreviewHeader personal={resume.personal} config={config} />
            )}

            {pageSections.map((section, idx) => (
              <PreviewSection
                key={section.id}
                section={section}
                config={config}
                isDimmed={
                  !!activeSectionId && activeSectionId !== section.id
                }
                isFirstOnPage={idx === 0}
              />
            ))}

            {showFooter && (
              <div
                style={{
                  position: "absolute",
                  bottom: `${bottomMarginPx}px`,
                  left: `${leftMarginPx}px`,
                  right: `${rightMarginPx}px`,
                  textAlign: "center",
                  fontSize: toCssFontSize(typography.fontSize.connections),
                  color: colors.footer,
                  fontFamily: typography.fontFamily.connections,
                }}
              >
                {makeFooterText(pageIdx + 1, pageDistribution.length)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
