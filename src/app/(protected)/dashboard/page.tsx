import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus, FileText, Lock, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import { getResumes, createResume } from "@/lib/resumes/actions";
import { getUser } from "@/lib/auth/actions";
import { getProfile } from "@/lib/profile/actions";
import { Button } from "@/components/ui/button";
import { ResumeCard } from "./ResumeCard";
import { RESUME_LIMITS } from "@/constants/limits";
import { UpgradePrompt } from "./UpgradePrompt";

export default async function DashboardPage() {
  const user = await getUser();
  const t = await getTranslations("dashboard");

  if (!user) {
    redirect("/login");
  }

  const [resumes, profile] = await Promise.all([
    getResumes(),
    getProfile(),
  ]);

  const isPremium = profile?.is_premium ?? false;
  const maxResumes = isPremium ? RESUME_LIMITS.PRO_MAX_RESUMES : RESUME_LIMITS.FREE_MAX_RESUMES;
  const isAtLimit = resumes.length >= maxResumes;

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/dashboard/trash" />}
            >
              <Trash2 className="size-4" />
              {t("trash")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/dashboard/settings" />}
              aria-label={t("settings")}
            >
              <Settings className="size-4" />
            </Button>
            <form action={createResume}>
              <Button type="submit" disabled={isAtLimit}>
                {isAtLimit ? <Lock className="size-4" /> : <Plus className="size-4" />}
                {isAtLimit ? t("limitReached") : t("createNew")}
              </Button>
            </form>
          </div>
        </div>

        {/* Content */}
        {resumes.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{t("empty")}</h2>
            <p className="mb-6 text-muted-foreground">{t("emptyDescription")}</p>
            <form action={createResume}>
              <Button type="submit">
                <Plus className="size-4" />
                {t("createNew")}
              </Button>
            </form>
          </div>
        ) : (
          // Resume Grid
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Upgrade Prompt */}
        {isAtLimit && !isPremium && <UpgradePrompt />}
      </div>
    </div>
  );
}
