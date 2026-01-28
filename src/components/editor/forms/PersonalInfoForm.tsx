"use client";

import { useResumeStore } from "@/stores/useResumeStore";
import { isStringItem, getItemTypeLabel } from "@/lib/resume-helpers";
import { RESUME_LIMITS } from "@/constants/limits";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PersonalInfoForm() {
  const personal = useResumeStore((state) => state.resume.personal);
  const updatePersonal = useResumeStore((state) => state.updatePersonal);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonal({ fullName: e.target.value });
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonal({ jobTitle: e.target.value });
  };

  const handleDetailChange = (itemId: string, newValue: string) => {
    const updatedDetails = personal.details.map((item) => {
      if (item.id === itemId && isStringItem(item)) {
        return { ...item, value: newValue };
      }
      return item;
    });
    updatePersonal({ details: updatedDetails });
  };

  const fullNameCount = personal.fullName?.length || 0;
  const jobTitleCount = personal.jobTitle?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={personal.fullName}
            onChange={handleFullNameChange}
            placeholder="John Doe"
            maxLength={RESUME_LIMITS.MAX_FULL_NAME}
          />
          <div className={cn(
            "text-xs text-right",
            fullNameCount >= RESUME_LIMITS.MAX_FULL_NAME * 0.9 ? "text-amber-500" : "text-muted-foreground"
          )}>
            {fullNameCount} / {RESUME_LIMITS.MAX_FULL_NAME}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={personal.jobTitle ?? ""}
            onChange={handleJobTitleChange}
            placeholder="Software Engineer"
            maxLength={RESUME_LIMITS.MAX_JOB_TITLE}
          />
          <div className={cn(
            "text-xs text-right",
            jobTitleCount >= RESUME_LIMITS.MAX_JOB_TITLE * 0.9 ? "text-amber-500" : "text-muted-foreground"
          )}>
            {jobTitleCount} / {RESUME_LIMITS.MAX_JOB_TITLE}
          </div>
        </div>

        {personal.details.map((item) => {
          if (!isStringItem(item)) return null;

          return (
            <div key={item.id} className="space-y-2">
              <Label htmlFor={item.id}>{getItemTypeLabel(item.type)}</Label>
              <Input
                id={item.id}
                value={item.value}
                onChange={(e) => handleDetailChange(item.id, e.target.value)}
                placeholder={getItemTypeLabel(item.type)}
                maxLength={RESUME_LIMITS.MAX_TEXT_FIELD}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

