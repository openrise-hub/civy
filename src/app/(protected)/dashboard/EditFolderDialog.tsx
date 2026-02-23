"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastManager } from "@/components/ui/toast";
import { updateFolder } from "@/lib/folders/actions";
import type { Folder } from "@/lib/folders/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type EditFolderDialogProps = {
  folder: Folder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditFolderDialog({ folder, open, onOpenChange }: EditFolderDialogProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [name, setName] = useState(folder?.name || "");
  const [prevFolderId, setPrevFolderId] = useState(folder?.id);
  const [isPending, startTransition] = useTransition();

  // Sync prop changes
  if (folder?.id !== prevFolderId) {
    setPrevFolderId(folder?.id);
    setName(folder?.name || "");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !folder) return;

    startTransition(async () => {
      const result = await updateFolder(folder.id, name);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("folderRenamed") || "Folder renamed" });
        onOpenChange(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("renameFolder") || "Rename Folder"}</DialogTitle>
            <DialogDescription>
              {t("renameFolderDesc") || "Update the name of this folder."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-folder-name">{t("folderName") || "Folder Name"}</Label>
              <Input
                id="edit-folder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("folderNamePlaceholder") || "Folder Name"}
                autoFocus
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" disabled={isPending}>{tCommon("cancel")}</Button>} />
            <Button type="submit" disabled={!name.trim() || name.trim() === folder?.name || isPending}>
              {isPending ? (tCommon("save") + "...") : tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
