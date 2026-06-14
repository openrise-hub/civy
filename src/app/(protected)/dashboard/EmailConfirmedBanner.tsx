"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function EmailConfirmedBanner() {
  const t = useTranslations("dashboard");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 shrink-0" />
        <p className="text-sm font-medium">{t("emailConfirmed")}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-md p-1 hover:bg-green-200 dark:hover:bg-green-900/50"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
