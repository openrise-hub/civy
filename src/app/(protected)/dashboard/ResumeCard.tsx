"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileText, Pencil, Trash2, Copy, EyeIcon, Folder as FolderIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { deleteResume, duplicateResume, saveResume, assignResumeToFolder, type ResumeListItem } from "@/lib/resumes/actions";
import type { Folder } from "@/lib/folders/actions";

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

type ResumeCardProps = {
  resume: ResumeListItem;
  viewCount?: number;
  folders?: Folder[];
  onDeleted?: () => void;
};

export function ResumeCard({ resume, viewCount, folders, onDeleted }: ResumeCardProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editTitle, setEditTitle] = useState(resume.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRenameStart = () => {
    setEditTitle(resume.title);
    setIsRenaming(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleRenameSubmit = () => {
    const trimmed = editTitle.trim();
    setIsRenaming(false);
    if (!trimmed || trimmed === resume.title) return;

    startTransition(async () => {
      const result = await saveResume(resume.id, { title: trimmed });
      if (result.error) {
        toastManager.add({
          type: "error",
          title: t("renameError") || "Error",
          description: result.error,
        });
      } else {
        toastManager.add({
          type: "success",
          title: t("renameSuccess") || "Renamed",
        });
        router.refresh();
      }
    });
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setEditTitle(resume.title);
    }
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      const result = await duplicateResume(resume.id);
      if (result.error) {
        toastManager.add({
          type: "error",
          title: t("duplicateError") || "Error",
          description: result.error,
        });
      } else {
        toastManager.add({
          type: "success",
          title: t("duplicateSuccess") || "Resume duplicated",
        });
        router.refresh();
      }
    });
  };

  const handleAssignFolder = (folderId: string | null) => {
    startTransition(async () => {
      const result = await assignResumeToFolder(resume.id, folderId);
      if (result.error) toastManager.add({ type: "error", title: result.error });
      else {
        toastManager.add({ type: "success", title: "Moved to folder" });
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      const result = await deleteResume(resume.id);
      if (result.error) {
        toastManager.add({
          type: "error",
          title: t("deleteError") || "Error",
          description: result.error,
        });
      } else {
        toastManager.add({
          type: "success",
          title: t("deleteSuccess") || "Resume deleted",
        });
        onDeleted?.();
        router.refresh(); // Force refresh to update server components
      }
      setShowConfirm(false);
    });
  };

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            {isRenaming ? (
              <input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleRenameKeyDown}
                className="w-full rounded border border-input bg-background px-1.5 py-0.5 text-base font-semibold outline-none ring-ring/24 focus-visible:ring-2"
                maxLength={100}
              />
            ) : (
              <CardTitle
                className="truncate text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded px-1 -ml-1 transition-shadow"
                onDoubleClick={handleRenameStart}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRenameStart();
                  }
                }}
                title={t("rename")}
                aria-label={`${resume.title || t("untitled")}. ${t("rename")}`}
              >
                {resume.title || t("untitled")}
              </CardTitle>
            )}
            <CardDescription>
              {t("editedAgo", { time: formatRelativeTime(resume.updated_at) })}
              {resume.is_public && viewCount !== undefined && viewCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <EyeIcon className="size-3" />
                  {viewCount.toLocaleString()}
                </span>
              )}
              {resume.folders && (
                <span className="ml-2 inline-flex">
                  <Badge variant="secondary" className="px-1.5 py-0 min-h-4 h-4 text-[10px] font-normal" size="sm">
                    {resume.folders.name}
                  </Badge>
                </span>
              )}
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className={showConfirm ? "text-destructive" : ""}
            aria-label={t("delete")}
          >
            <Trash2 className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="gap-2">
        {showConfirm ? (
          <>
            <span className="text-sm text-destructive">{t("confirmDelete")}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? t("deleting") : t("delete")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/editor/${resume.id}`} />}
            >
              <Pencil className="size-4" />
              {t("edit")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDuplicate}
              disabled={isPending}
              aria-label={t("duplicate")}
            >
              <Copy className="size-4" />
            </Button>
            {folders && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="sm" variant="ghost" disabled={isPending} aria-label={t("moveToFolder") || "Move to Folder"}>
                      <FolderIcon className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48 z-50">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-medium">{t("moveToFolder") || "Move to Folder"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAssignFolder(null)}>
                      {t("noFolder") || "No Folder"}
                    </DropdownMenuItem>
                    {folders.length > 0 && <DropdownMenuSeparator />}
                    {folders.map(f => (
                      <DropdownMenuItem key={f.id} onClick={() => handleAssignFolder(f.id)}>
                        {f.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
