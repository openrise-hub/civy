"use client";

import { useTranslations } from "next-intl";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";
import { Button } from "@/components/ui/button";
import { CrownIcon, CheckIcon } from "lucide-react";

const FEATURES = [
  "resumes",
  "templates",
  "history",
  "support",
] as const;

export function UpgradePrompt() {
  const t = useTranslations("dashboard");
  const tP = useTranslations("premium");
  const tC = useTranslations("common");

  return (
    <div className="mt-8 rounded-xl border bg-gradient-to-r from-primary/5 to-primary/10 p-6 text-center">
      <CrownIcon className="size-10 mx-auto mb-3 text-yellow-500" />
      <h3 className="text-lg font-semibold">{t("upgradeTitle")}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {t("upgradeDescription")}
      </p>

      <div className="max-w-xs mx-auto space-y-2 mb-5 text-left">
        {FEATURES.map((key) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <CheckIcon className="size-4 shrink-0 text-green-500" />
            <span>{tP(`features.${key}`)}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckIcon className="size-4 shrink-0 text-green-500" />
          <span>{tC("andMore")}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {tP("from")} {tP("monthlyPrice")}/{tP("perMonth")}
      </p>

      <UpgradeModal
        trigger={
          <Button variant="default">
            <CrownIcon className="size-4" />
            {t("upgradeButton")}
          </Button>
        }
      />
    </div>
  );
}
