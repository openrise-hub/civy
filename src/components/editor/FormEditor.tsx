"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useResumeStore } from "@/stores/useResumeStore";
import { PersonalInfoForm } from "@/components/editor/forms/PersonalInfoForm";
import { SectionManager } from "@/components/editor/SectionManager";
import { useSave } from "@/contexts/SaveContext";
import { PlusIcon, ArrowLeftIcon, SaveIcon } from "lucide-react";

export function FormEditor() {
  const t = useTranslations("editor.formEditor");
  const { addSection } = useResumeStore();
  const { saveNow } = useSave();

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" render={<Link href="/dashboard" />}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h2 className="text-lg font-semibold">{t("title")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={saveNow}>
            <SaveIcon className="size-4" />
            <span>Save</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("custom")}>
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
