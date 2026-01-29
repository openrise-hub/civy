import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getUser, signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  const t = await getTranslations("dashboard");
  const tAuth = await getTranslations("auth");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("welcome", { email: user.email ?? "" })}
        </p>
      </div>

      <div className="flex gap-4">
        <Button render={<Link href="/editor/new" />}>
          {t("goToEditor")}
        </Button>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            {tAuth("signOut")}
          </Button>
        </form>
      </div>
    </div>
  );
}
