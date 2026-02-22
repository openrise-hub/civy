"use client";

import { type ResumeListItem } from "@/lib/resumes/actions";
import { ResumeCard } from "./ResumeCard";

import type { Folder } from "@/lib/folders/actions";

type ResumeGridProps = {
  resumes: ResumeListItem[];
  viewCounts: Record<string, number>;
  folders: Folder[];
  isSelectionMode: boolean;
  selectedResumes: Set<string>;
  setSelectedResumes: (selected: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
};

export function ResumeGrid({ 
  resumes, 
  viewCounts, 
  folders,
  isSelectionMode,
  selectedResumes,
  setSelectedResumes
}: ResumeGridProps) {
  const toggleSelect = (id: string) => {
    setSelectedResumes((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-full">
      {/* Resume Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className={`relative ${isSelectionMode ? "cursor-pointer" : ""}`}
            onClick={isSelectionMode ? () => toggleSelect(resume.id) : undefined}
          >
            {isSelectionMode && (
              <div
                className={`absolute inset-0 z-10 rounded-xl border-2 transition-colors pointer-events-none ${
                  selectedResumes.has(resume.id)
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <div className="absolute top-3 left-3">
                  <div
                    className={`flex size-5 items-center justify-center rounded border-2 transition-colors ${
                      selectedResumes.has(resume.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {selectedResumes.has(resume.id) && (
                      <svg
                        className="size-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ResumeCard
              resume={resume}
              viewCount={viewCounts[resume.id] ?? 0}
              folders={folders}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
