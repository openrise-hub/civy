"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/stores/useResumeStore";
import { PersonalInfoForm } from "@/components/editor/forms/PersonalInfoForm";
import { SectionManager } from "@/components/editor/SectionManager";
import { ShareModal } from "@/components/editor/ShareModal";
import { useSave } from "@/contexts/SaveContext";
import { PlusIcon, ArrowLeftIcon, SaveIcon, PencilIcon } from "lucide-react";

type FormEditorProps = {
  resumeId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
};

export function FormEditor({ resumeId, initialIsPublic, initialSlug }: FormEditorProps) {
  const t = useTranslations("editor.formEditor");
  const { resume, addSection } = useResumeStore();
  const updateTitle = useResumeStore((state) => state.setResume);
  const { saveNow } = useSave();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      updateTitle({ ...resume, title: titleValue.trim() });
    } else {
      setTitleValue(resume.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTitleValue(resume.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" render={<Link href="/dashboard" />}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          {isEditingTitle ? (
            <Input
              ref={inputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="h-8 text-lg font-semibold w-48"
            />
          ) : (
            <button
              onClick={() => {
                setTitleValue(resume.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-2 text-lg font-semibold hover:text-muted-foreground transition-colors group"
            >
              <span>{resume.title || "Untitled Resume"}</span>
              <PencilIcon className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ShareModal 
            resumeId={resumeId}
            initialIsPublic={initialIsPublic}
            initialSlug={initialSlug}
          />
          <Button size="sm" variant="outline" onClick={saveNow}>
            <SaveIcon className="size-4" />
            <span>Save</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("custom")} className="add-section-btn">
            <PlusIcon className="size-4" />
            <span>{t("addSection")}</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <PersonalInfoForm />

          <Separator />

          {/* Dynamic Sections */}
          <SectionManager />
        </div>
      </ScrollArea>
    </div>
  );
}
