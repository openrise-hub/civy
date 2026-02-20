import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, EyeIcon, DownloadIcon, CrownIcon, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/auth/actions";
import { getProfile } from "@/lib/profile/actions";
import { getResumes } from "@/lib/resumes/actions";
import { getAnalyticsSummary } from "@/lib/analytics/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";

export default async function AnalyticsPage() {
  const user = await getUser();
  const t = await getTranslations("analytics");

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();
  const isPremium = profile?.is_premium ?? false;

  // Pro-only gating
  if (!isPremium) {
    return (
      <div className="min-h-dvh bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
              <ArrowLeft className="size-4" />
              {t("backToDashboard")}
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <CrownIcon className="size-8 text-yellow-500" />
            </div>
            <h2 className="text-lg font-semibold">{t("proOnly")}</h2>
            <p className="mb-6 text-muted-foreground">{t("proOnlyDescription")}</p>
            <UpgradeModal />
          </div>
        </div>
      </div>
    );
  }

  const [analytics, resumes] = await Promise.all([
    getAnalyticsSummary(),
    getResumes(),
  ]);

  // Create a map of resume IDs to titles
  const resumeTitles = new Map(resumes.map((r) => [r.id, r.title]));

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
              <ArrowLeft className="size-4" />
              {t("backToDashboard")}
            </Button>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <EyeIcon className="size-4" />
                {t("totalViews")}
              </CardDescription>
              <CardTitle className="text-3xl">
                {analytics.totalViews.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <DownloadIcon className="size-4" />
                {t("totalDownloads")}
              </CardDescription>
              <CardTitle className="text-3xl">
                {analytics.totalDownloads.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Per-Resume Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              {t("perResume")}
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            {analytics.resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t("noData")}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 font-medium">{t("resumeName")}</th>
                      <th className="pb-3 font-medium text-right">{t("views")}</th>
                      <th className="pb-3 font-medium text-right">{t("downloads")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.resumes.map((row) => (
                      <tr key={row.resumeId} className="border-b last:border-0">
                        <td className="py-3">
                          <Link
                            href={`/editor/${row.resumeId}`}
                            className="text-primary hover:underline"
                          >
                            {resumeTitles.get(row.resumeId) ?? t("untitled")}
                          </Link>
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {row.views.toLocaleString()}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {row.downloads.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
