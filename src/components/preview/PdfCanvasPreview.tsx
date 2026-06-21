"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import { pdf } from "@react-pdf/renderer";
import type { Resume } from "@/types/resume";
import { Loader2 } from "lucide-react";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import type { TemplateConfig } from "@/types/template";

interface PdfTranslations {
  present: string;
  phone: string;
  email: string;
  image: string;
  location: string;
  website: string;
  [key: string]: string;
}

interface PdfCanvasPreviewProps {
  resume: Resume;
  translations: PdfTranslations;
  templateName?: string;
  templateConfig?: Partial<TemplateConfig>;
  zoom?: number;
}

interface PageRender {
  imageData: ImageBitmap;
  width: number;
  height: number;
}

export function PdfCanvasPreview({
  resume,
  translations,
  templateName = "modern",
  templateConfig,
  zoom = 1,
}: PdfCanvasPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageRenders, setPageRenders] = useState<PageRender[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
  const pdfDocRef = useRef<pdfjs.PDFDocumentProxy | null>(null);
  const activeRenderId = useRef(0);

  const generatePdfBlob = useCallback(async () => {
    try {
      const pdfDocument = (
        <UniversalPdf
          resume={resume}
          templateName={templateName}
          templateConfig={templateConfig}
          translations={translations}
        />
      );
      const blob = await pdf(pdfDocument).toBlob();
      return blob;
    } catch (err) {
      console.error("Error generating PDF:", err);
      throw err;
    }
  }, [resume, templateName, templateConfig, translations]);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setError(null);

      try {
        const blob = await generatePdfBlob();
        const arrayBuffer = await blob.arrayBuffer();

        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;

        if (cancelled) {
          doc.destroy();
          return;
        }

        // Clean up previous doc
        if (pdfDocRef.current) {
          pdfDocRef.current.destroy();
        }
        pdfDocRef.current = doc;
        setIsInitialLoad(false);

        // Trigger render
        activeRenderId.current += 1;
        renderAllPages(activeRenderId.current);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load PDF");
          setIsInitialLoad(false);
        }
      }
    };

    const debounceTimeout = setTimeout(() => {
      loadPdf();
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimeout);
    };
  }, [generatePdfBlob]);

  // Cleanup old page renders on re-render
  useEffect(() => {
    return () => {
      for (const render of pageRenders) {
        render.imageData.close();
      }
    };
  }, []);

  const renderAllPages = useCallback(
    async (renderId: number) => {
      const doc = pdfDocRef.current;
      if (!doc || !wrapperRef.current) return;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      try {
        const containerW = wrapperRef.current.clientWidth;
        const numPages = doc.numPages;

        // Calculate common scale based on first page
        const firstPage = await doc.getPage(1);
        const firstViewport = firstPage.getViewport({ scale: 1 });
        const padding = 32;
        const availableWidth = containerW - padding;
        const baseScale = availableWidth / firstViewport.width;
        const scale = baseScale * zoom;

        const renders: PageRender[] = [];
        const offscreenCanvas = document.createElement("canvas");
        const offscreenCtx = offscreenCanvas.getContext("2d");
        if (!offscreenCtx) return;

        for (let i = 1; i <= numPages; i++) {
          if (renderId !== activeRenderId.current) return;

          const page = i === 1 ? firstPage : await doc.getPage(i);
          const viewport = page.getViewport({ scale });

          offscreenCanvas.width = viewport.width;
          offscreenCanvas.height = viewport.height;

          renderTaskRef.current = page.render({
            canvasContext: offscreenCtx,
            viewport,
            canvas: offscreenCanvas,
          });

          await renderTaskRef.current.promise;

          const imageData = await createImageBitmap(offscreenCanvas);
          renders.push({
            imageData,
            width: viewport.width,
            height: viewport.height,
          });
        }

        if (renderId === activeRenderId.current) {
          // Clean up previous renders
          for (const prev of pageRenders) {
            prev.imageData.close();
          }
          setPageRenders(renders);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("cancelled")) {
          return;
        }
        console.error("Error rendering PDF pages:", err);
      }
    },
    [zoom, pageRenders]
  );

  // Re-render on zoom change
  useEffect(() => {
    if (pdfDocRef.current) {
      activeRenderId.current += 1;
      renderAllPages(activeRenderId.current);
    }
  }, [zoom, renderAllPages]);

  // Re-render on container resize
  useEffect(() => {
    if (!wrapperRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = wrapperRef.current.clientWidth;

    const resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect.width;
      if (newWidth === undefined) return;

      if (Math.abs(newWidth - lastWidth) < 5) return;
      lastWidth = newWidth;

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setContainerWidth(newWidth);
        if (pdfDocRef.current) {
          activeRenderId.current += 1;
          renderAllPages(activeRenderId.current);
        }
      }, 50);
    });

    resizeObserver.observe(wrapperRef.current);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [renderAllPages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
      }
      for (const render of pageRenders) {
        render.imageData.close();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col" ref={wrapperRef}>
      <ScrollArea className="flex-1 w-full">
        <div
          className="min-h-full min-w-full w-max flex flex-col items-center gap-6 p-6"
          style={{
            backgroundColor: "hsl(var(--muted) / 0.5)",
            backgroundImage:
              "radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          {isInitialLoad && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="size-8 animate-spin text-muted-foreground/50" />
              <p className="text-muted-foreground bg-background/80 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
                Generating preview...
              </p>
            </div>
          )}

          {pageRenders.map((page, idx) => (
            <canvas
              key={idx}
              ref={(el) => {
                if (!el) return;
                const ctx = el.getContext("2d");
                if (!ctx) return;
                el.width = page.width;
                el.height = page.height;
                // Only draw if not already drawn (React may reuse canvas)
                if (el.dataset.drawn !== "true") {
                  ctx.drawImage(page.imageData, 0, 0);
                  el.dataset.drawn = "true";
                }
              }}
              style={{
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#ffffff",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
