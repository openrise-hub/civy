import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus, FileText } from "lucide-react";
import { getResumes, createResume } from "@/lib/resumes/actions";
import { getUser } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { ResumeCard } from "./ResumeCard";

export default async function DashboardPage() {
  const user = await getUser();
  const t = await getTranslations("dashboard");

  if (!user) {
    redirect("/login");
  }

  const resumes = await getResumes();

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <form action={createResume}>
            <Button type="submit">
              <Plus className="size-4" />
              {t("createNew")}
            </Button>
          </form>
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
      </div>
    </div>
  );
}
