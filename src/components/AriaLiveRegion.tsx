"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";

interface AriaLiveState {
  message: string;
  announce: (message: string) => void;
  clear: () => void;
}

// Global store for screen reader announcements
export const useAriaLive = create<AriaLiveState>((set) => ({
  message: "",
  announce: (message: string) => set({ message }),
  clear: () => set({ message: "" }),
}));

/**
 * A visually hidden component that reads out global app changes to screen readers.
 * Must be mounted once high up in the component tree (e.g., in layout.tsx)
 */
export function AriaLiveRegion() {
  const message = useAriaLive((state) => state.message);
  const clear = useAriaLive((state) => state.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Clear message after rendering so it can be re-announced later if the same string occurs
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        clear();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, clear]);

  if (!mounted) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
