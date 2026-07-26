"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { getAllIndustries } from "@/lib/templates/registry";
import { toastManager } from "@/components/ui/toast";
import { Loader2Icon, FileEditIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { createOnboardingResume } from "./actions";
import type { OnboardingPayload } from "./actions";

const DEGREES = ["High School", "Associate", "Bachelor", "Master", "PhD"];
const CURRENT_MONTH = new Date().toISOString().slice(0, 7);

function filterItems<T extends string>(items: T[], query: string, limit = 200): T[] {
  if (!query || query.length < 1) return items.slice(0, limit);
  const q = query.toLowerCase();
  return items.filter((item) => item.toLowerCase().includes(q)).slice(0, limit);
}

interface ExpEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  currentRole: boolean;
  description: string;
}

interface EduEntry {
  degree: string;
  field: string;
  institution: string;
  year: string;
}

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tInd = useTranslations("industries");
  const td = useTranslations("dashboard");
  const ta = useTranslations("ai");
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const industries = useMemo(() => [...getAllIndustries(), "Other"], []);

  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [titlesLoaded, setTitlesLoaded] = useState(false);

  const [industryValue, setIndustryValue] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [jobTitleValue, setJobTitleValue] = useState("");
  const [jobTitleSearch, setJobTitleSearch] = useState("");
  const [jobTitleTyped, setJobTitleTyped] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationTyped, setLocationTyped] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  const [experience, setExperience] = useState<ExpEntry[]>([
    { company: "", title: "", startDate: "2022-01", endDate: CURRENT_MONTH, currentRole: true, description: "" },
  ]);
  const [noExperience, setNoExperience] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");

  const [education, setEducation] = useState<EduEntry[]>([
    { degree: "Bachelor", field: "", institution: "", year: "" },
  ]);
  const [keySkills, setKeySkills] = useState("");

  const [generating, setGenerating] = useState(false);
  const [generationTip, setGenerationTip] = useState(0);
  const tipRef = useRef(td.raw("tips") as string[] | undefined);

  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((d: string[]) => { setCities(d); })
      .catch(() => {})
      .finally(() => setCitiesLoaded(true));
  }, []);

  useEffect(() => {
    fetch("/data/job-titles.json")
      .then((r) => r.json())
      .then((d: string[]) => { setJobTitles(d); })
      .catch(() => {})
      .finally(() => setTitlesLoaded(true));
  }, []);

  useEffect(() => {
    if (!generating) return;
    const tips = tipRef.current;
    if (!tips || tips.length === 0) return;
    const interval = setInterval(() => {
      setGenerationTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [generating]);

  const filteredCities = useMemo(() => {
    const query = locationSearch.trim();
    if (query.length < 2) return [];
    return cities.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 200);
  }, [locationSearch, cities]);

  const filteredJobTitles = useMemo(() => jobTitleSearch ? filterItems(jobTitles, jobTitleSearch) : [], [jobTitleSearch, jobTitles]);
  const filteredIndustries = useMemo(() => industrySearch ? filterItems(industries as string[], industrySearch) : [], [industrySearch, industries]);

  function getField(name: string, searchText: string, typed?: string): string {
    return name || typed || searchText;
  }

  const addExperience = () => setExperience((prev) => [...prev, { company: "", title: "", startDate: CURRENT_MONTH, endDate: CURRENT_MONTH, currentRole: false, description: "" }]);
  const removeExperience = (i: number) => setExperience((prev) => prev.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof ExpEntry, value: string) => {
    setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  };

  const addEducation = () => setEducation((prev) => [...prev, { degree: "Bachelor", field: "", institution: "", year: "" }]);
  const removeEducation = (i: number) => setEducation((prev) => prev.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof EduEntry, value: string) => {
    setEducation((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  };

  const handleSkip = async () => {
    setGenerating(true);
    const result = await createOnboardingResume({ fullName: fullName || "Untitled", jobTitle: "", industry: "", email: "", phone: "", location: "", linkedin: "", website: "", experience: [], noExperience: false, projectDescription: "", education: [], keySkills: "", skipAi: true });
    setGenerating(false);
    if (result.error) {
      toastManager.add({ type: "error", title: ta(result.error) || result.error });
      return;
    }
    if (result.editorId) router.push(`/editor/${result.editorId}`);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const payload: OnboardingPayload = {
      fullName,
      jobTitle: getField(jobTitleValue, jobTitleSearch, jobTitleTyped),
      industry: getField(industryValue, industrySearch),
      email,
      phone,
      location: getField(locationValue, locationSearch, locationTyped),
      linkedin,
      website,
      locale,
      experience: noExperience ? [] : experience.filter((e) => e.company || e.title).map((e) => ({ ...e, endDate: e.currentRole ? "Present" : e.endDate })),
      noExperience,
      projectDescription,
      education: education.filter((e) => e.institution || e.field),
      keySkills,
    };
    const result = await createOnboardingResume(payload);
    setGenerating(false);
    if (result.error) {
      toastManager.add({ type: "error", title: ta(result.error) || result.error });
      return;
    }
    if (result.editorId) router.push(`/editor/${result.editorId}`);
  };

  const canNext = () => {
    if (step === 1) return fullName.trim().length > 0;
    if (step === 2) {
      if (noExperience) return true;
      return experience.some((e) => e.company.trim() || e.title.trim());
    }
    return true;
  };

  if (generating) {
    const tips = tipRef.current;
    const currentTip = tips && tips.length > 0 ? tips[generationTip % tips.length] : null;
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <div className="w-full max-w-md text-center">
          <Loader2Icon className="size-8 animate-spin mx-auto mb-6 text-primary" />
          <h2 className="text-xl font-bold mb-4">{t("generating") || "Generating your CV..."}</h2>
          {currentTip && (
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{currentTip}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">{t("generatingHint") || "This may take a few seconds"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i + 1 === step ? "w-8 bg-primary" : i + 1 < step ? "w-2 bg-primary/50" : "w-2 bg-muted"}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-4">
            {`${t("step") || "Step"} ${step} ${t("of") || "of"} ${totalSteps}`}
          </p>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("fullName")} *</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("fullNamePlaceholder")} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("jobTitle")}</label>
                  <Combobox value={jobTitleValue} onValueChange={(v) => setJobTitleValue(v ?? "")} inputValue={jobTitleSearch || jobTitleTyped} onInputValueChange={(v) => { setJobTitleSearch(v); if (v) setJobTitleTyped(v); }}>
                    <ComboboxInput placeholder={titlesLoaded ? t("jobTitlePlaceholder") : t("loading")} className="w-full" showTrigger={true} />
                    <ComboboxPopup className="w-[--anchor-width]">
                      {filteredJobTitles.length > 0 ? (
                        <ComboboxList>{filteredJobTitles.map((title) => (<ComboboxItem key={title} value={title}>{title}</ComboboxItem>))}</ComboboxList>
                      ) : jobTitleSearch ? (
                        <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                      ) : null}
                    </ComboboxPopup>
                  </Combobox>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("email")}</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t("emailPlaceholder")} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("phone")}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder={t("phonePlaceholder")} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("location")}</label>
                <Combobox value={locationValue} onValueChange={(v) => setLocationValue(v ?? "")} inputValue={locationSearch || locationTyped} onInputValueChange={(v) => { setLocationSearch(v); if (v) setLocationTyped(v); }}>
                  <ComboboxInput placeholder={citiesLoaded ? t("locationPlaceholder") : t("loading")} className="w-full" showTrigger={true} />
                  <ComboboxPopup className="w-[--anchor-width]">
                    {filteredCities.length > 0 ? (
                      <ComboboxList className="max-h-60">{filteredCities.map((city) => (<ComboboxItem key={city} value={city}>{city}</ComboboxItem>))}</ComboboxList>
                    ) : locationSearch.length >= 2 ? (
                      <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                    ) : null}
                  </ComboboxPopup>
                </Combobox>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("linkedin")}</label>
                  <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} type="url" placeholder={t("linkedinPlaceholder")} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t("website")}</label>
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} type="url" placeholder={t("websitePlaceholder")} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("industry")}</label>
                <Combobox value={industryValue} onValueChange={(v) => setIndustryValue(v ?? "")} inputValue={industrySearch} onInputValueChange={setIndustrySearch}>
                  <ComboboxInput placeholder={t("industryPlaceholder")} className="w-full" showTrigger={true} />
                <ComboboxPopup className="w-[--anchor-width]">
                  {filteredIndustries.length > 0 ? (
                    <ComboboxList>{filteredIndustries.map((ind) => (<ComboboxItem key={ind} value={ind}>{ind === "Other" ? "Other" : tInd(ind)}</ComboboxItem>))}</ComboboxList>
                  ) : industrySearch ? (
                    <ComboboxEmpty>{t("noResults")}</ComboboxEmpty>
                  ) : null}
                </ComboboxPopup>
                </Combobox>
                <p className="text-xs text-muted-foreground mt-1">{t("industryHint")}</p>
              </div>
            </div>
          )}

          {/* Step 2: Work Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noExperience} onChange={(e) => setNoExperience(e.target.checked)} className="rounded" />
                <span className="text-sm">{t("noExperience") || "I have no professional experience"}</span>
              </label>

              {noExperience ? (
                <div>
                  <label className="block text-sm font-medium mb-1">{t("projectDescription") || "Describe your projects, education, or skills"}</label>
                  <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={4} placeholder={t("projectDescriptionPlaceholder") || "Built a personal website using React. Completed an online course in data science. Volunteered as a tutor for high school students..."} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                </div>
              ) : (
                <>
                  {experience.map((exp, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                      {experience.length > 1 && (
                        <button onClick={() => { if (window.confirm(t("confirmRemoveExperience") || "Remove this entry?")) removeExperience(i); }} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2Icon size={14} /></button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">{t("company") || "Company"}</label>
                          <input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder={t("companyPlaceholder") || "Acme Corp"} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">{t("role") || "Role"}</label>
                          <input value={exp.title} onChange={(e) => updateExperience(i, "title", e.target.value)} placeholder={t("rolePlaceholder") || "Software Engineer"} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">{t("startDate") || "Start Date"}</label>
                          <input type="month" value={exp.startDate} onChange={(e) => setExperience(prev => prev.map((ex, idx) => { if (idx !== i) return ex; const u = { ...ex, startDate: e.target.value }; if (!ex.currentRole && ex.endDate && e.target.value > ex.endDate) u.endDate = e.target.value; return u; }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">{t("endDate") || "End Date"}</label>
                          <input type="month" value={exp.currentRole ? "" : exp.endDate} disabled={exp.currentRole} onChange={(e) => { if (exp.startDate && e.target.value < exp.startDate) return; updateExperience(i, "endDate", e.target.value); }} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white disabled:opacity-50" />
                          <label className="flex items-center gap-1 mt-1 cursor-pointer">
                            <input type="checkbox" checked={exp.currentRole} onChange={(e) => setExperience(prev => prev.map((ex, idx) => idx === i ? { ...ex, currentRole: e.target.checked, endDate: e.target.checked ? "" : ex.endDate || CURRENT_MONTH } : ex))} className="rounded" />
                            <span className="text-xs text-muted-foreground">{t("currentRole") || "I currently work here"}</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">{t("whatDid") || "What did you do?"}</label>
                        <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} rows={3} placeholder={t("whatDidPlaceholder") || "Led a team of 4 developers. Built customer-facing dashboard. Reduced bugs by improving the testing pipeline."} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                      </div>
                    </div>
                  ))}
                  {experience.length < 5 && (
                    <button type="button" onClick={addExperience} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <PlusIcon size={14} />{t("addRole") || "Add Another Role"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                  {education.length > 1 && (
                    <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2Icon size={14} /></button>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1">{t("degree") || "Degree"}</label>
                    <select value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                      {DEGREES.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t("fieldOfStudy") || "Field of Study"}</label>
                    <input value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} placeholder={t("fieldPlaceholder") || "Computer Science"} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t("institution") || "Institution"}</label>
                    <input value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder={t("institutionPlaceholder") || "University of California"} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t("gradYear") || "Graduation Year"}</label>
                    <select value={edu.year} onChange={(e) => updateEducation(i, "year", e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                      <option value="">--</option>
                      {Array.from({ length: 50 }, (_, n) => String(2026 - n)).map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                  </div>
                </div>
              ))}
              {education.length < 3 && (
                <button type="button" onClick={addEducation} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <PlusIcon size={14} />{t("addDegree") || "Add Another Degree"}
                </button>
              )}
            </div>
          )}

          {/* Step 4: Skills & Generate */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("keySkills") || "Key Skills"}</label>
                <textarea value={keySkills} onChange={(e) => setKeySkills(e.target.value)} rows={2} placeholder={t("keySkillsPlaceholder") || "React, TypeScript, leadership, project management"} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                <p className="text-xs text-muted-foreground mt-1">{t("keySkillsHint") || "The AI will expand your skills into a full list."}</p>
              </div>
              <button onClick={handleGenerate} className="w-full rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <FileEditIcon size={16} />
                {t("generateCv") || "Generate My CV"}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <button type="button" onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("skip")}
            </button>
            <div className="flex gap-2">
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                  <ChevronLeftIcon size={16} />{t("back") || "Back"}
                </button>
              )}
              {step < totalSteps && (
                <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {t("next") || "Next"}<ChevronRightIcon size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
