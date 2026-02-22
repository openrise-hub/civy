"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { deleteFolder } from "@/lib/folders/actions";
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

type DeleteFolderDialogProps = {
  folder: Folder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteFolderDialog({ folder, open, onOpenChange, onSuccess }: DeleteFolderDialogProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!folder) return;

    startTransition(async () => {
      const result = await deleteFolder(folder.id);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("folderDeleted") || "Folder deleted" });
        onOpenChange(false);
        if (onSuccess) onSuccess();
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteFolder") || "Delete Folder"}</DialogTitle>
          <DialogDescription>
            {t("deleteFolderConfirm") || "Are you sure you want to delete this folder? Your resumes will not be deleted, they will just be moved out of this folder."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" disabled={isPending}>{tCommon("cancel")}</Button>} />
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? t("deleting") : tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
