"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText, RotateCcw, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import {
  restoreResume,
  type DeletedResumeItem,
} from "@/lib/resumes/actions";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "just now";
}

function formatTimeRemaining(deletedAt: string): string {
  const deletedDate = new Date(deletedAt);
  const purgeDate = new Date(deletedDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remainingMs = purgeDate.getTime() - now.getTime();
  const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
  const remainingDays = Math.floor(remainingHours / 24);

  if (remainingDays > 0) return `${remainingDays}d ${remainingHours % 24}h`;
  if (remainingHours > 0) return `${remainingHours}h`;
  return "< 1h";
}

type TrashCardProps = {
  resume: DeletedResumeItem;
};

export function TrashCard({ resume }: TrashCardProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreResume(resume.id);
      if (result.error) {
        toastManager.add({
          type: "error",
          title: t("restoreError") || "Error",
          description: result.error,
        });
      } else {
        toastManager.add({
          type: "success",
          title: t("restoreSuccess") || "Resume restored",
        });
        router.refresh();
      }
    });
  };

  return (
    <Card className="opacity-75 transition-opacity hover:opacity-100">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {resume.title || t("untitled")}
            </CardTitle>
            <CardDescription>
              {t("deletedAgo", {
                time: formatRelativeTime(resume.deleted_at),
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRestore}
          disabled={isPending}
        >
          <RotateCcw className="size-4" />
          {t("restore")}
        </Button>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {t("autoDeleteWarning", {
            time: formatTimeRemaining(resume.deleted_at),
          })}
        </span>
      </CardFooter>
    </Card>
  );
}
