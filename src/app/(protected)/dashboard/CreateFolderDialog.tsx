"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastManager } from "@/components/ui/toast";
import { createFolder } from "@/lib/folders/actions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function CreateFolderDialog() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      const result = await createFolder(name);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("folderCreated") });
        setOpen(false);
        setName("");
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="mr-2 size-4" />
            {t("createNewFolder")}
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("createNewFolder")}</DialogTitle>
            <DialogDescription>
              {t("organizeCollections")}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">{t("folderName")}</Label>
              <Input
                id="folder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("folderNamePlaceholder")}
                autoFocus
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" disabled={isPending}>{tCommon("cancel")}</Button>} />
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
