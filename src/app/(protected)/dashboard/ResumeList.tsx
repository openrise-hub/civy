"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2, FileText, Copy, Pencil, MoreVertical, Folder as FolderIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { deleteResume, duplicateResume, assignResumeToFolder, type ResumeListItem } from "@/lib/resumes/actions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from "@/components/ui/menu";
import type { Folder } from "@/lib/folders/actions";

type ResumeListProps = {
  resumes: ResumeListItem[];
  viewCounts: Record<string, number>;
  folders: Folder[];
  isSelectionMode: boolean;
  selectedResumes: Set<string>;
  setSelectedResumes: (selected: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return "just now";
  }
}

export function ResumeList({ 
  resumes, 
  viewCounts, 
  folders,
  isSelectionMode,
  selectedResumes,
  setSelectedResumes
}: ResumeListProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAssignFolder = (id: string, folderId: string | null) => {
    startTransition(async () => {
      const result = await assignResumeToFolder(id, folderId);
      if (result.error) toastManager.add({ type: "error", title: result.error });
      else {
        toastManager.add({ type: "success", title: "Moved to folder" });
        router.refresh();
      }
    });
  };

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

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const result = await duplicateResume(id);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("duplicateSuccess") || "Duplicated" });
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const result = await deleteResume(id);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("deleteSuccess") || "Deleted" });
        router.refresh();
      }
    });
  };

  return (
    <div>

      {/* List Container */}
      <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {resumes.map((resume, index) => (
          <div
            key={resume.id}
            className={`group relative flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 ${
              index !== resumes.length - 1 ? "border-b" : ""
            } ${isSelectionMode && selectedResumes.has(resume.id) ? "bg-primary/5 hover:bg-primary/10" : ""}`}
            onClick={isSelectionMode ? () => toggleSelect(resume.id) : undefined}
          >
            {/* Selection Checkbox Area */}
            {isSelectionMode && (
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors cursor-pointer ${
                  selectedResumes.has(resume.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-background"
                }`}
              >
                {selectedResumes.has(resume.id) && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}

            {/* Icon */}
            <div className="hidden sm:flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <Link
                  href={isSelectionMode ? "#" : `/editor/${resume.id}`}
                  className={`truncate text-base font-semibold hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 -ml-1 ${isSelectionMode ? "pointer-events-none" : ""}`}
                >
                  {resume.title || t("untitled")}
                </Link>
                {resume.folders && (
                  <Badge variant="secondary" className="font-normal">
                    {resume.folders.name}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {t("editedAgo", { time: formatRelativeTime(resume.updated_at) })}
                {resume.is_public && viewCounts[resume.id] > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <EyeIcon className="size-3" />
                    {viewCounts[resume.id].toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {!isSelectionMode && (
                <>
                  <Button size="icon-sm" variant="ghost" className="hidden sm:inline-flex" onClick={() => router.push(`/editor/${resume.id}`)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDuplicate(resume.id)}
                    disabled={isPending}
                    className="hidden sm:inline-flex"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button size="icon-sm" variant="ghost" aria-label="More options">
                          <MoreVertical className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48 z-50">
                      <DropdownMenuItem onClick={() => router.push(`/editor/${resume.id}`)}>
                        <Pencil className="mr-2 size-4" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(resume.id)}>
                        <Copy className="mr-2 size-4" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <FolderIcon className="mr-2 size-4" />
                          {t("moveToFolder") || "Move to Folder"}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => handleAssignFolder(resume.id, null)}>
                              {t("noFolder") || "No Folder"}
                            </DropdownMenuItem>
                            {folders.length > 0 && <DropdownMenuSeparator />}
                            {folders.map(f => (
                              <DropdownMenuItem key={f.id} onClick={() => handleAssignFolder(resume.id, f.id)}>
                                {f.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
