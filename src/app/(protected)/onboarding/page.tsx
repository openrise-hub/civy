"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getAllIndustries, getTemplateList } from "@/lib/templates/registry";
import { createOnboardingResume } from "./actions";
import { useMemo } from "react";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tInd = useTranslations("industries");
  const router = useRouter();

  const industries = useMemo(() => getAllIndustries(), []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form action={createOnboardingResume} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                  {t("fullName")} <span className="text-destructive">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="jobTitle">
                  {t("jobTitle")}
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder={t("jobTitlePlaceholder")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                {t("location")}
              </label>
              <input
                id="location"
                name="location"
                placeholder={t("locationPlaceholder")}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="linkedin">
                  {t("linkedin")}
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1" htmlFor="website">
                  {t("website")}
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="industry">
                {t("industry")}
              </label>
              <select
                id="industry"
                name="industry"
                defaultValue=""
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">{t("industryPlaceholder")}</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {tInd(ind)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">{t("industryHint")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="summary">
                {t("summary")}
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                placeholder={t("summaryPlaceholder")}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("skip")}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
