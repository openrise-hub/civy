"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAllIndustries } from "@/lib/templates/registry";
import { createOnboardingResume } from "./actions";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tInd = useTranslations("industries");
  const router = useRouter();

  const industries = useMemo(() => getAllIndustries(), []);

  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [titlesLoaded, setTitlesLoaded] = useState(false);
  const [jobTitleValue, setJobTitleValue] = useState("");
  const [jobTitleSearch, setJobTitleSearch] = useState("");

  const [industryValue, setIndustryValue] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");

  const filteredJobTitles = useMemo(() => {
    if (!jobTitleSearch) return jobTitles.slice(0, 200);
    const q = jobTitleSearch.toLowerCase();
    return jobTitles.filter((t) => t.toLowerCase().includes(q)).slice(0, 200);
  }, [jobTitleSearch, jobTitles]);

  const filteredCities = useMemo(() => {
    if (locationSearch.length < 2) return [];
    const q = locationSearch.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q)).slice(0, 200);
  }, [locationSearch, cities]);

  const filteredIndustries = useMemo(() => {
    if (!industrySearch) return industries;
    const q = industrySearch.toLowerCase();
    return industries.filter(
      (ind) => tInd(ind).toLowerCase().includes(q) || ind.toLowerCase().includes(q)
    );
  }, [industrySearch, industries, tInd]);

  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((d) => {
        setCities(d);
        setCitiesLoaded(true);
      })
      .catch(() => setCitiesLoaded(true));

    fetch("/data/job-titles.json")
      .then((r) => r.json())
      .then((d) => {
        setJobTitles(d);
        setTitlesLoaded(true);
      })
      .catch(() => setTitlesLoaded(true));
  }, []);

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
                <label className="block text-sm font-medium mb-1">
                  {t("jobTitle")}
                </label>
                <Combobox
                  value={jobTitleValue}
                  onValueChange={(val) => setJobTitleValue(val ?? "")}
                  inputValue={jobTitleSearch}
                  onInputValueChange={setJobTitleSearch}
                >
                  <ComboboxInput
                    placeholder={titlesLoaded ? t("jobTitlePlaceholder") : t("loading")}
                    className="w-full"
                    showTrigger={false}
                  />
                  <ComboboxPopup className="w-[--anchor-width]">
                    <ComboboxList>
                      {filteredJobTitles.map((title) => (
                        <ComboboxItem key={title} value={title}>
                          {title}
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxPopup>
                </Combobox>
                <input type="hidden" name="jobTitle" value={jobTitleValue} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  {t("email")}
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  {t("phone")}
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("location")}
              </label>
              <Combobox
                value={locationValue}
                onValueChange={(val) => setLocationValue(val ?? "")}
                inputValue={locationSearch}
                onInputValueChange={setLocationSearch}
              >
                <ComboboxInput
                  placeholder={citiesLoaded ? t("locationPlaceholder") : t("loading")}
                  className="w-full"
                  showTrigger={false}
                />
                <ComboboxPopup className="w-[--anchor-width]">
                  <ComboboxList className="max-h-60">
                    {filteredCities.map((city) => (
                      <ComboboxItem key={city} value={city}>
                        {city}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>
              <input type="hidden" name="location" value={locationValue} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  {t("linkedin")}
                </label>
                <input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  {t("website")}
                </label>
                <input
                  name="website"
                  type="url"
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("industry")}
              </label>
              <Combobox
                value={industryValue}
                onValueChange={(val) => setIndustryValue(val ?? "")}
                inputValue={industrySearch}
                onInputValueChange={setIndustrySearch}
              >
                <ComboboxInput
                  placeholder={t("industryPlaceholder")}
                  className="w-full"
                  showTrigger={true}
                />
                <ComboboxPopup className="w-[--anchor-width]">
                  <ComboboxList>
                    {filteredIndustries.map((ind) => (
                      <ComboboxItem key={ind} value={ind}>
                        {tInd(ind)}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>
              <input type="hidden" name="industry" value={industryValue} />
              <p className="text-xs text-muted-foreground mt-1">
                {t("industryHint")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("summary")}
              </label>
              <textarea
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
