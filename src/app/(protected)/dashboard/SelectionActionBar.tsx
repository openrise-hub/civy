"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Copy, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { bulkDeleteResumes, bulkDuplicateResumes, type ResumeListItem } from "@/lib/resumes/actions";

type SelectionActionBarProps = {
  selectedResumes: Set<string>;
  setSelectedResumes: (selected: Set<string>) => void;
  setIsSelectionMode: (mode: boolean) => void;
  resumes: ResumeListItem[];
};

export function SelectionActionBar({
  selectedResumes,
  setSelectedResumes,
  setIsSelectionMode,
  resumes,
}: SelectionActionBarProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (selectedResumes.size === 0) return null;

  const handleBulkDelete = () => {
    startTransition(async () => {
      const result = await bulkDeleteResumes(Array.from(selectedResumes));
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({
          type: "success",
          title: t("bulkDeleteSuccess", { count: result.count ?? 0 }) || `Deleted ${result.count} resumes.`,
        });
        setIsSelectionMode(false);
        setSelectedResumes(new Set());
        router.refresh();
      }
    });
  };

  const handleBulkDuplicate = () => {
    startTransition(async () => {
      const result = await bulkDuplicateResumes(Array.from(selectedResumes));
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({
          type: "success",
          title: t("bulkDuplicateSuccess", { count: result.count ?? 0 }) || `Duplicated ${result.count} resumes.`,
        });
        setIsSelectionMode(false);
        setSelectedResumes(new Set());
        router.refresh();
      }
    });
  };

  const selectAll = () => {
    if (selectedResumes.size === resumes.length) {
      setSelectedResumes(new Set());
    } else {
      setSelectedResumes(new Set(resumes.map((r) => r.id)));
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border shadow-lg rounded-full px-4 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-5">
      <span className="text-sm font-medium px-2 shrink-0">
        {t("itemsSelected", { count: selectedResumes.size })}
      </span>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        size="sm"
        variant="ghost"
        className="rounded-full"
        onClick={selectAll}
        disabled={isPending}
      >
        {selectedResumes.size === resumes.length ? t("deselectAll") || "Deselect All" : t("selectAll") || "Select All"}
      </Button>

      <Button
        size="sm"
        variant="secondary"
        className="rounded-full gap-2"
        onClick={handleBulkDuplicate}
        disabled={isPending}
      >
        <Copy className="size-4" />
        <span className="hidden sm:inline">{t("bulkDuplicate") || "Duplicate"}</span>
      </Button>

      <Button
        size="sm"
        variant="destructive"
        className="rounded-full gap-2"
        onClick={handleBulkDelete}
        disabled={isPending}
      >
        <Trash2 className="size-4" />
        <span className="hidden sm:inline">{t("bulkDelete") || "Delete"}</span>
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        size="icon"
        variant="ghost"
        className="rounded-full size-8 shrink-0"
        onClick={() => {
          setIsSelectionMode(false);
          setSelectedResumes(new Set());
        }}
        disabled={isPending}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
