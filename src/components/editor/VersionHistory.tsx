"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { History, RotateCcw, CrownIcon, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { useUser } from "@/contexts/UserContext";
import {
  getResumeHistory,
  restoreVersion,
  type HistoryEntry,
} from "@/lib/resumes/actions";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "just now";
}

type VersionHistoryProps = {
  resumeId: string;
  trigger: React.ReactElement;
};

export function VersionHistory({ resumeId, trigger }: VersionHistoryProps) {
  const t = useTranslations("versionHistory");
  const { isPremium } = useUser();
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!isPremium) return;
    setLoading(true);
    const data = await getResumeHistory(resumeId);
    setEntries(data);
    setLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchHistory();
    }
  };

  const handleRestore = (historyId: string) => {
    startTransition(async () => {
      const result = await restoreVersion(resumeId, historyId);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("restoreSuccess") });
        setOpen(false);
        router.refresh();
      }
      setConfirmId(null);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          {!isPremium ? (
            /* Free user lock screen */
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <CrownIcon className="size-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium">{t("proOnly")}</p>
              <p className="text-xs text-muted-foreground">
                {t("proOnlyDescription")}
              </p>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t("loading")}
            </div>
          ) : entries.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t("empty")}
            </div>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {t("versionLabel", { version: entry.version })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(entry.created_at)}
                    </div>
                  </div>
                  {confirmId === entry.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRestore(entry.id)}
                        disabled={isPending}
                      >
                        {isPending ? "..." : t("confirm")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmId(null)}
                        disabled={isPending}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmId(entry.id)}
                    >
                      <RotateCcw className="size-3" />
                      {t("restore")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
