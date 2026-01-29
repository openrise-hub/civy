"use client";

import { createContext, useContext } from "react";

type SaveContextValue = {
  saveNow: () => Promise<void>;
};

const SaveContext = createContext<SaveContextValue | undefined>(undefined);

export function SaveProvider({
  saveNow,
  children,
}: {
  saveNow: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <SaveContext.Provider value={{ saveNow }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error("useSave must be used within a SaveProvider");
  }
  return context;
}
