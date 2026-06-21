"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverPopup } from "@/components/ui/popover";
import { useResumeStore, SECTION_TEMPLATES } from "@/stores/useResumeStore";
import { PersonalInfoForm } from "@/components/editor/forms/PersonalInfoForm";
import { SectionManager } from "@/components/editor/SectionManager";
import { ShareModal } from "@/components/editor/ShareModal";
import { useSave } from "@/contexts/SaveContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  PlusIcon, ArrowLeftIcon, SaveIcon, PencilIcon, MenuIcon,
  BriefcaseIcon, GraduationCapIcon, WrenchIcon, TextIcon,
} from "lucide-react";

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
  const isMobile = useIsMobile();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sectionIcons: Record<string, React.ReactNode> = {
    experience: <BriefcaseIcon className="size-4" />,
    education: <GraduationCapIcon className="size-4" />,
    skills: <WrenchIcon className="size-4" />,
    summary: <TextIcon className="size-4" />,
    custom: <PlusIcon className="size-4" />,
  };

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
      <div className="flex items-center justify-between border-b bg-background px-3 py-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
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
              maxLength={100}
              className="h-8 text-lg font-semibold w-48"
            />
          ) : (
            <button
              onClick={() => {
                setTitleValue(resume.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-2 text-lg font-semibold hover:text-muted-foreground transition-colors group min-w-0 flex-1"
            >
              <span className="truncate">{resume.title || "Untitled Resume"}</span>
              <PencilIcon className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ShareModal 
            resumeId={resumeId}
            initialIsPublic={initialIsPublic}
            initialSlug={initialSlug}
            iconOnly={isMobile}
          />
          <Button size="sm" variant="outline" onClick={saveNow}>
            <SaveIcon className="size-4" />
            {!isMobile && <span>Save</span>}
          </Button>
          {isMobile ? (
            <Popover>
              <PopoverTrigger
                render={
                  <Button size="icon-sm" variant="outline">
                    <MenuIcon className="size-4" />
                  </Button>
                }
              />
              <PopoverPopup align="end" side="bottom" sideOffset={4} className="w-auto p-0">
                <div className="flex flex-col gap-0.5 min-w-44 p-1">
                  {Object.keys(SECTION_TEMPLATES).map((key) => (
                    <button
                      key={key}
                      onClick={() => addSection(key, t(key))}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors text-left"
                    >
                      {sectionIcons[key] || <PlusIcon className="size-4" />}
                      {t(key)}
                    </button>
                  ))}
                </div>
              </PopoverPopup>
            </Popover>
          ) : (
            <Button size="sm" variant="outline" onClick={() => addSection("custom")} className="add-section-btn">
              <PlusIcon className="size-4" />
              <span>{t("addSection")}</span>
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          <PersonalInfoForm />

          <Separator />

          {/* Dynamic Sections */}
          <SectionManager />
        </div>
      </ScrollArea>
    </div>
  );
}
