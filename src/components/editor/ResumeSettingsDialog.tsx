"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SettingsIcon } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPanel,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Field, FieldLabel } from "@/components/ui/field";

export function ResumeSettingsDialog({ isCollapsed }: { isCollapsed: boolean }) {
  const t = useTranslations("editor.sidebar");
  const [open, setOpen] = useState(false);
  
  const metadata = useResumeStore((state) => state.resume.metadata);
  const updateMetadata = useResumeStore((state) => state.updateMetadata);



  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMetadata({
      colors: { ...metadata.colors, background: e.target.value },
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMetadata({
      colors: { ...metadata.colors, text: e.target.value },
    });
  };

  const handlePrimaryAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccents = [...metadata.colors.accents];
    newAccents[0] = e.target.value;
    updateMetadata({
      colors: { ...metadata.colors, accents: newAccents },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenuButton tooltip={isCollapsed ? t("settings") : undefined} onClick={() => setOpen(true)}>
        <SettingsIcon />
        <span>{t("settings")}</span>
      </SidebarMenuButton>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
          <DialogDescription>
            Customize the appearance of your resume.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Colors</FieldLabel>
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bg-color" className="text-xs text-muted-foreground font-medium cursor-pointer">Background</label>
                  <input
                    id="bg-color"
                    type="color"
                    value={metadata.colors.background}
                    onChange={handleBackgroundChange}
                    className="h-9 w-full cursor-pointer rounded-md border border-input shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="text-color" className="text-xs text-muted-foreground font-medium cursor-pointer">Text</label>
                  <input
                    id="text-color"
                    type="color"
                    value={metadata.colors.text}
                    onChange={handleTextChange}
                    className="h-9 w-full cursor-pointer rounded-md border border-input shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="accent-color" className="text-xs text-muted-foreground font-medium cursor-pointer">Accent</label>
                  <input
                    id="accent-color"
                    type="color"
                    value={metadata.colors.accents[0]}
                    onChange={handlePrimaryAccentChange}
                    className="h-9 w-full cursor-pointer rounded-md border border-input shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
              </div>
            </Field>
          </div>
        </DialogPanel>
      </DialogContent>
    </Dialog>
  );
}
