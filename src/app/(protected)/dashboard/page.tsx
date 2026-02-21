import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus, FileText, Lock, Trash2, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getResumes, createResume } from "@/lib/resumes/actions";
import { getUser } from "@/lib/auth/actions";
import { getProfile } from "@/lib/profile/actions";
import { getAllResumeViewCounts } from "@/lib/analytics/actions";
import { Button } from "@/components/ui/button";
import { RESUME_LIMITS } from "@/constants/limits";
import { UpgradePrompt } from "./UpgradePrompt";
import { UserNav } from "@/components/UserNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ResumeDashboardClient } from "./ResumeDashboardClient";

export default async function DashboardPage() {
  const user = await getUser();
  const t = await getTranslations("dashboard");

  if (!user) {
    redirect("/login");
  }

  const [resumes, profile, viewCounts] = await Promise.all([
    getResumes(),
    getProfile(),
    getAllResumeViewCounts(),
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
              size="sm"
              render={<Link href="/dashboard/analytics" />}
            >
              <BarChart3 className="size-4" />
              {t("analytics")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/dashboard/settings" />}
              aria-label={t("settings")}
            >
              <Settings className="size-4" />
            </Button>
            <LanguageToggle />
            <form action={createResume}>
              <Button type="submit" disabled={isAtLimit}>
                {isAtLimit ? <Lock className="size-4" /> : <Plus className="size-4" />}
                {isAtLimit ? t("limitReached") : t("createNew")}
              </Button>
            </form>
            <div className="ml-2">
              <UserNav />
            </div>
          </div>
        </div>

        {/* Content */}
        {resumes.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-muted/10 py-24 px-6 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
              <FileText className="size-10 text-primary/80" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">{t("empty")}</h2>
            <p className="mb-8 max-w-sm text-muted-foreground">{t("emptyDescription")}</p>
            <form action={createResume}>
              <Button type="submit" size="lg" className="rounded-full px-8 shadow-sm">
                <Plus className="mr-2 size-5" />
                {t("createNew")}
              </Button>
            </form>
          </div>
        ) : (
          // Client Wrapper for Search, Sort, and Grid
          <ResumeDashboardClient resumes={resumes} viewCounts={viewCounts} />
        )}

        {/* Upgrade Prompt */}
        {isAtLimit && !isPremium && <UpgradePrompt />}
      </div>
    </div>
  );
}
