"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import { pdf } from "@react-pdf/renderer";
import type { Resume } from "@/types/resume";
import { Loader2 } from "lucide-react";
import { UniversalPdf } from "@/components/pdf/UniversalPdf";
import { PdfTranslations } from "@/components/pdf/engine/ItemRenderers";
import { ScrollArea } from "@/components/ui/scroll-area";

// Set worker path for pdf.js - use jsdelivr CDN which has the latest version
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
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
      const page = await pdfDoc.getPage(1);
      const visibleCanvas = canvasRef.current;
      
      // Get container width from the rigidly styled outer wrapper
      const containerWidth = wrapperRef.current.clientWidth;
      
      // Get original page dimensions
      const viewport = page.getViewport({ scale: 1 });
      
      // Calculate scale to fit container width with padding
      const padding = 32; // 16px on each side
      const availableWidth = containerWidth - padding;
      const baseScale = availableWidth / viewport.width;
      const scale = baseScale * zoom;
      
      // Apply scale
      const scaledViewport = page.getViewport({ scale });

      // Create offscreen canvas for double buffering
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement("canvas");
      }
      const offscreenCanvas = offscreenCanvasRef.current;
      const offscreenContext = offscreenCanvas.getContext("2d");

      if (!offscreenContext) return;

      // Set offscreen canvas dimensions
      offscreenCanvas.width = scaledViewport.width;
      offscreenCanvas.height = scaledViewport.height;

      // Render to offscreen canvas
      renderTaskRef.current = page.render({
        canvasContext: offscreenContext,
        viewport: scaledViewport,
        canvas: offscreenCanvas,
      });

      await renderTaskRef.current.promise;

      // Now copy to visible canvas (this is instant, no flicker)
      const visibleContext = visibleCanvas.getContext("2d");
      if (visibleContext) {
        // Only resize visible canvas after offscreen render is complete
        visibleCanvas.width = scaledViewport.width;
        visibleCanvas.height = scaledViewport.height;
        // Immediately draw the offscreen content
        visibleContext.drawImage(offscreenCanvas, 0, 0);
      }
    } catch (err) {
      // Ignore cancelled renders
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
