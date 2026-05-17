"use client";

import { v4 as uuidv4 } from "uuid";
import { useResumeStore } from "@/stores/useResumeStore";
import { isStringItem, isLinkItem, getItemTypeLabel } from "@/lib/resume-helpers";
import { RESUME_LIMITS } from "@/constants/limits";
import type { Item, ItemType } from "@/types/resume";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneIcon, MailIcon, MapPinIcon, LinkIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const CONTACT_TYPES: { type: ItemType; label: string; icon: React.ReactNode }[] = [
  { type: "phone", label: "Phone", icon: <PhoneIcon className="size-3.5" /> },
  { type: "email", label: "Email", icon: <MailIcon className="size-3.5" /> },
  { type: "location", label: "Location", icon: <MapPinIcon className="size-3.5" /> },
  { type: "link", label: "Link", icon: <LinkIcon className="size-3.5" /> },
];

export function PersonalInfoForm() {
  const t = useTranslations("editor");
  const personal = useResumeStore((state) => state.resume.personal);
  const updatePersonal = useResumeStore((state) => state.updatePersonal);
  const setActiveSectionId = useResumeStore((state) => state.setActiveSectionId);

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

  const handleLinkDetailChange = (itemId: string, field: "label" | "url", newValue: string) => {
    const updatedDetails = personal.details.map((item) => {
      if (item.id === itemId && isLinkItem(item)) {
        return { ...item, value: { ...item.value, [field]: newValue } };
      }
      return item;
    });
    updatePersonal({ details: updatedDetails });
  };

  const handleAddDetail = (type: ItemType) => {
    const newItem: Item = {
      id: uuidv4(),
      visible: true,
      type,
      value: type === "link" ? { label: "", url: "" } : "",
    } as Item;
    updatePersonal({ details: [...personal.details, newItem] });
  };

  const handleRemoveDetail = (itemId: string) => {
    updatePersonal({ details: personal.details.filter((item) => item.id !== itemId) });
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full Name</Label>
          <Input
            id="fullName"
            value={personal.fullName}
            onChange={handleFullNameChange}
            onFocus={() => setActiveSectionId(null)}
            placeholder={t("placeholders.fullName")}
            maxLength={RESUME_LIMITS.MAX_FULL_NAME}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="jobTitle" className="text-xs text-muted-foreground">Job Title</Label>
          <Input
            id="jobTitle"
            value={personal.jobTitle ?? ""}
            onChange={handleJobTitleChange}
            onFocus={() => setActiveSectionId(null)}
            placeholder={t("placeholders.jobTitle")}
            maxLength={RESUME_LIMITS.MAX_JOB_TITLE}
          />
        </div>

        {personal.details.map((item) => {
          if (isLinkItem(item)) {
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Link</Label>
                  <button
                    onClick={() => handleRemoveDetail(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <TrashIcon className="size-3.5" />
                  </button>
                </div>
                <Input
                  value={item.value.label}
                  onChange={(e) => handleLinkDetailChange(item.id, "label", e.target.value)}
                  onFocus={() => setActiveSectionId(null)}
                  placeholder="Label"
                  maxLength={RESUME_LIMITS.MAX_TEXT_FIELD}
                />
                <Input
                  value={item.value.url}
                  onChange={(e) => handleLinkDetailChange(item.id, "url", e.target.value)}
                  onFocus={() => setActiveSectionId(null)}
                  placeholder="https://..."
                  maxLength={RESUME_LIMITS.MAX_TEXT_FIELD}
                />
              </div>
            );
          }

          if (!isStringItem(item)) return null;

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={item.id}>{getItemTypeLabel(item.type, t)}</Label>
                <button
                  onClick={() => handleRemoveDetail(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </div>
              <Input
                id={item.id}
                value={item.value}
                onChange={(e) => handleDetailChange(item.id, e.target.value)}
                onFocus={() => setActiveSectionId(null)}
                placeholder={getItemTypeLabel(item.type, t)}
                maxLength={RESUME_LIMITS.MAX_TEXT_FIELD}
              />
            </div>
          );
        })}

        {personal.details.length < RESUME_LIMITS.MAX_PERSONAL_DETAILS && (
          <div className="flex items-center justify-center gap-1 pt-2">
            {CONTACT_TYPES.map((ct) => (
              <button
                key={ct.type}
                onClick={() => handleAddDetail(ct.type)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {ct.icon}
                {ct.label}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

