"use client";

import { createContext, useContext } from "react";

type SaveContextValue = {
  saveNow: () => Promise<void>;
  isDirty: boolean;
};

const SaveContext = createContext<SaveContextValue | undefined>(undefined);

export function SaveProvider({
  saveNow,
  isDirty,
  children,
}: {
  saveNow: () => Promise<void>;
  isDirty: boolean;
  children: React.ReactNode;
}) {
  return (
    <SaveContext.Provider value={{ saveNow, isDirty }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const context = useContext(SaveContext);
  if (context === undefined) {
    return { saveNow: async () => {}, isDirty: false };
  }
  return context;
}
