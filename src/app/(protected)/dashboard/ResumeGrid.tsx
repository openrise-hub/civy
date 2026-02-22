"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { bulkDeleteResumes, type ResumeListItem } from "@/lib/resumes/actions";
import { ResumeCard } from "./ResumeCard";

import type { Folder } from "@/lib/folders/actions";

type ResumeGridProps = {
  resumes: ResumeListItem[];
  viewCounts: Record<string, number>;
  folders: Folder[];
};

export function ResumeGrid({ resumes, viewCounts, folders }: ResumeGridProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === resumes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(resumes.map((r) => r.id)));
    }
  };

  const exitSelecting = () => {
    setSelecting(false);
    setSelected(new Set());
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    startTransition(async () => {
      const result = await bulkDeleteResumes(Array.from(selected));
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({
          type: "success",
          title: t("bulkDeleteSuccess", { count: result.count ?? 0 }),
        });
        exitSelecting();
        router.refresh();
      }
    });
  };

  return (
    <div>
      {/* Selection toolbar */}
      <div className="mb-4 flex items-center gap-2">
        {selecting ? (
          <>
            <Button size="sm" variant="outline" onClick={selectAll}>
              <CheckSquare className="size-4" />
              {selected.size === resumes.length
                ? t("deselectAll")
                : t("selectAll")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={selected.size === 0 || isPending}
            >
              <Trash2 className="size-4" />
              {isPending
                ? t("deleting")
                : t("deleteSelected", { count: selected.size })}
            </Button>
            <Button size="sm" variant="ghost" onClick={exitSelecting}>
              <X className="size-4" />
              {t("cancelSelection")}
            </Button>
          </>
        ) : (
          resumes.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelecting(true)}
            >
              <CheckSquare className="size-4" />
              {t("selectResumes")}
            </Button>
          )
        )}
      </div>

      {/* Resume Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className={`relative ${selecting ? "cursor-pointer" : ""}`}
            onClick={selecting ? () => toggleSelect(resume.id) : undefined}
          >
            {selecting && (
              <div
                className={`absolute inset-0 z-10 rounded-xl border-2 transition-colors ${
                  selected.has(resume.id)
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <div className="absolute top-3 left-3">
                  <div
                    className={`flex size-5 items-center justify-center rounded border-2 transition-colors ${
                      selected.has(resume.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {selected.has(resume.id) && (
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
