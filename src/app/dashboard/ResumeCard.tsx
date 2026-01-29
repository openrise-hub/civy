"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileText, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteResume, type ResumeListItem } from "@/lib/resumes/actions";

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
  onDeleted?: () => void;
};

export function ResumeCard({ resume, onDeleted }: ResumeCardProps) {
  const t = useTranslations("dashboard");
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      const result = await deleteResume(resume.id);
      if (!result.error) {
        onDeleted?.();
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
            <CardTitle className="truncate text-base">
              {resume.title || t("untitled")}
            </CardTitle>
            <CardDescription>
              {t("editedAgo", { time: formatRelativeTime(resume.updated_at) })}
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
          <Button
            size="sm"
            variant="outline"
            render={<Link href={`/editor/${resume.id}`} />}
          >
            <Pencil className="size-4" />
            {t("edit")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
