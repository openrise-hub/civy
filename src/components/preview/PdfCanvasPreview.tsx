"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
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

interface PdfCanvasPreviewProps {
  resume: Resume;
  translations: PdfTranslations;
  templateName?: string;
  zoom?: number;
}

export function PdfCanvasPreview({ 
  resume, 
  translations,
  templateName = "modern",
  templateConfig,
  zoom = 1 
}: PdfCanvasPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);

  // Generate PDF blob from react-pdf/renderer
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
  }, [resume, templateName, translations]);

  // Load PDF document - debounced to prevent blinking
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

        setPdfDoc(doc);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load PDF");
        }
      } finally {
        setIsInitialLoad(false);
      }
    };

    // Debounce PDF generation by 500ms to prevent blinking while typing
    const debounceTimeout = setTimeout(() => {
      loadPdf();
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimeout);
    };
  }, [generatePdfBlob]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !wrapperRef.current) return;

    // Cancel any ongoing render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    try {
      const visibleCanvas = canvasRef.current;
      const containerWidth = wrapperRef.current.clientWidth;
      const padding = 32;
      const availableWidth = containerWidth - padding;
      const numPages = pdfDoc.numPages;

      // Get the first page's viewport to calculate the common scale
      const firstPage = await pdfDoc.getPage(1);
      const firstViewport = firstPage.getViewport({ scale: 1 });
      const baseScale = availableWidth / firstViewport.width;
      const scale = baseScale * zoom;

      // Calculate total canvas dimensions by pre-computing all page viewports
      const pageViewports: pdfjs.PageViewport[] = [];
      let totalHeight = 0;
      let maxWidth = 0;
      const pageGap = 16; // visual gap between pages

      for (let i = 1; i <= numPages; i++) {
        const page = i === 1 ? firstPage : await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        pageViewports.push(viewport);
        totalHeight += viewport.height + (i < numPages ? pageGap : 0);
        maxWidth = Math.max(maxWidth, viewport.width);
      }

      // Set visible canvas dimensions to fit all pages
      visibleCanvas.width = maxWidth;
      visibleCanvas.height = totalHeight;
      const visibleContext = visibleCanvas.getContext("2d");
      if (!visibleContext) return;

      // Clear the canvas
      visibleContext.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);

      // Render each page at the correct y offset
      let yOffset = 0;
      for (let i = 0; i < pageViewports.length; i++) {
        const viewport = pageViewports[i];

        // Create offscreen canvas for double-buffered rendering of this page
        const offscreenCanvas = document.createElement("canvas");
        const offscreenContext = offscreenCanvas.getContext("2d");
        if (!offscreenContext) continue;

        offscreenCanvas.width = viewport.width;
        offscreenCanvas.height = viewport.height;

        const page = i === 0 ? firstPage : await pdfDoc.getPage(i + 1);
        renderTaskRef.current = page.render({
          canvasContext: offscreenContext,
          viewport,
          canvas: offscreenCanvas,
        });

        await renderTaskRef.current.promise;

        // Draw page onto visible canvas at current y offset
        visibleContext.drawImage(offscreenCanvas, (maxWidth - viewport.width) / 2, yOffset);
        yOffset += viewport.height + pageGap;
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("cancelled")) {
        return;
      }
      console.error("Error rendering PDF page:", err);
    }
  }, [pdfDoc, zoom]);

  // Re-render on pdfDoc change
  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, renderPage]);

  // Re-render on container resize - debounced to prevent blinking
  useEffect(() => {
    if (!wrapperRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = wrapperRef.current.clientWidth;

    const resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect.width;
      if (newWidth === undefined) return;
      
      // Only re-render if width changed by more than 5px (prevents scrollbar flicker)
      if (Math.abs(newWidth - lastWidth) < 5) return;
      
      lastWidth = newWidth;

      // Debounce: wait for resize to settle
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderPage();
      }, 50);
    });

    resizeObserver.observe(wrapperRef.current);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [renderPage]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [pdfDoc]);

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
          className="min-h-full min-w-full w-max flex justify-center items-start p-4"
          style={{
            backgroundColor: 'hsl(var(--muted) / 0.5)',
            backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        >
          {isInitialLoad && (
            <div className="flex flex-col items-center justify-center py-8 absolute inset-0 gap-2">
              <Loader2 className="size-8 animate-spin text-muted-foreground/50" />
              <p className="text-muted-foreground bg-background/80 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">Generating preview...</p>
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className="shadow-lg bg-card"
            style={{ 
              display: isInitialLoad ? 'none' : 'block',
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
