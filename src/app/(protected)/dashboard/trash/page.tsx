import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getUser } from "@/lib/auth/actions";
import { getDeletedResumes } from "@/lib/resumes/actions";
import { Button } from "@/components/ui/button";
import { TrashCard } from "./TrashCard";

export default async function TrashPage() {
  const user = await getUser();
  const t = await getTranslations("dashboard");

  if (!user) {
    redirect("/login");
  }

  const deletedResumes = await getDeletedResumes();

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/dashboard" />}
              aria-label={t("backToDashboard")}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t("trash")}</h1>
          </div>
        </div>

        {/* Content */}
        {deletedResumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <Trash2 className="size-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{t("trashEmpty")}</h2>
            <p className="mb-6 max-w-md text-center text-muted-foreground">
              {t("trashEmptyDescription")}
            </p>
            <Button variant="outline" render={<Link href="/dashboard" />}>
              <ArrowLeft className="size-4" />
              {t("backToDashboard")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deletedResumes.map((resume) => (
              <TrashCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
