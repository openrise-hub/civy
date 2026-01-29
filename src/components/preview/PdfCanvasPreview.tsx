"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import { pdf } from "@react-pdf/renderer";
import type { Resume } from "@/types/resume";
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
}

export function PdfCanvasPreview({ 
  resume, 
  translations,
  templateName = "modern" 
}: PdfCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Render PDF page to canvas using double buffering
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    // Cancel any ongoing render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    try {
      const page = await pdfDoc.getPage(1);
      const visibleCanvas = canvasRef.current;
      const container = containerRef.current;

      // Get container width for responsive scaling
      const containerWidth = container.clientWidth;
      
      // Get original page dimensions
      const viewport = page.getViewport({ scale: 1 });
      
      // Calculate scale to fit container width with padding
      const padding = 32; // 16px on each side
      const availableWidth = containerWidth - padding;
      const scale = availableWidth / viewport.width;
      
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
  }, [pdfDoc]);

  // Re-render on pdfDoc change
  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, renderPage]);

  // Re-render on container resize - debounced to prevent blinking
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = containerRef.current.clientWidth;

    const resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect.width;
      
      // Only re-render if width changed by more than 5px (prevents scrollbar flicker)
      if (Math.abs(newWidth - lastWidth) < 5) return;
      
      lastWidth = newWidth;

      // Debounce: wait for resize to settle
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderPage();
      }, 50);
    });

    resizeObserver.observe(containerRef.current);

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
    <ScrollArea className="h-full w-full">
      <div 
        ref={containerRef} 
        className="w-full flex flex-col items-center"
        style={{
          minHeight: '100%',
          backgroundColor: 'hsl(var(--muted) / 0.5)',
          backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {isInitialLoad && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Generating preview...</p>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="my-4 shadow-lg"
          style={{ 
            display: isInitialLoad ? 'none' : 'block',
            maxWidth: '100%',
          }}
        />
      </div>
    </ScrollArea>
  );
}
