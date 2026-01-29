"use client";

import { useEffect, useRef, useCallback } from "react";
import { useResumeStore } from "@/stores/useResumeStore";
import { saveResume } from "@/lib/resumes/actions";
import { toastManager } from "@/components/ui/toast";

const DEBOUNCE_MS = 300000; // 5 minutes

export function useAutoSave(resumeId: string) {
  const resume = useResumeStore((state) => state.resume);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const isSavingRef = useRef(false);

  const save = useCallback(async (showToast = true) => {
    if (isSavingRef.current) return;

    const dataToSave = {
      title: resume.title,
      data: {
        metadata: resume.metadata,
        personal: resume.personal,
        sections: resume.sections,
      },
    };

    const serialized = JSON.stringify(dataToSave);
    if (serialized === lastSavedRef.current) return;

    isSavingRef.current = true;

    try {
      const result = await saveResume(resumeId, dataToSave);
      
      if (result.error) {
        if (showToast) {
          toastManager.add({
            type: "error",
            title: "Failed to save",
            description: result.error,
          });
        }
      } else {
        lastSavedRef.current = serialized;
        if (showToast) {
          toastManager.add({
            type: "success",
            title: "CV Autosaved",
          });
        }
      }
    } catch {
      if (showToast) {
        toastManager.add({
          type: "error",
          title: "Failed to save",
        });
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [resumeId, resume]);

  // Manual save function (for save button)
  const saveNow = useCallback(async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    isSavingRef.current = false; // Allow save even if one was in progress
    
    const dataToSave = {
      title: resume.title,
      data: {
        metadata: resume.metadata,
        personal: resume.personal,
        sections: resume.sections,
      },
    };

    const serialized = JSON.stringify(dataToSave);
    if (serialized === lastSavedRef.current) {
      toastManager.add({
        type: "info",
        title: "Already saved",
      });
      return;
    }

    isSavingRef.current = true;

    try {
      const result = await saveResume(resumeId, dataToSave);
      
      if (result.error) {
        toastManager.add({
          type: "error",
          title: "Failed to save",
          description: result.error,
        });
      } else {
        lastSavedRef.current = serialized;
        toastManager.add({
          type: "success",
          title: "CV Saved",
        });
      }
    } catch {
      toastManager.add({
        type: "error",
        title: "Failed to save",
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [resumeId, resume]);

  // Auto-save debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resume, save]);

  // Save on tab blur/visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        save(false); // Silent save on tab blur
      }
    };

    const handleBeforeUnload = () => {
      save(false); // Silent save before close
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [save]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      save(false);
    };
  }, [save]);

  return { saveNow };
}
