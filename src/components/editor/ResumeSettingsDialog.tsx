"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { SettingsIcon, Trash2, Check, Save, Loader2, TriangleAlert } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { getCustomTemplates, saveCustomTemplate, deleteCustomTemplate, type CustomTemplate } from "@/lib/templates/actions";
import { getContrastRatio } from "@/lib/color-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [newTemplateName, setNewTemplateName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  
  const metadata = useResumeStore((state) => state.resume.metadata);
  const updateMetadata = useResumeStore((state) => state.updateMetadata);

  const contrastRatio = getContrastRatio(metadata.colors.background, metadata.colors.text);
  const isLowContrast = contrastRatio < 4.5;

  // Fetch templates when dialog opens
  useEffect(() => {
    let isMounted = true;
    
    const fetchTemplates = async () => {
      setIsFetching(true);
      try {
        const data = await getCustomTemplates();
        if (isMounted) setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    if (open) {
      fetchTemplates();
    }
    
    return () => {
      isMounted = false;
    };
  }, [open]);

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || isPending) return;
    setErrorMsg(null);
    
    startTransition(async () => {
      try {
        const res = await saveCustomTemplate(newTemplateName.trim(), metadata);
        
        if (res.error) {
          if (res.error === "LIMIT_FREE") {
            setErrorMsg(t("limitFree"));
          } else if (res.error === "LIMIT_PRO") {
            setErrorMsg(t("limitPro"));
          } else {
            setErrorMsg(t("saveError"));
          }
          return;
        }

        if (res.data) {
          setTemplates((prev) => [res.data as CustomTemplate, ...prev]);
          setNewTemplateName("");
        }
      } catch (error) {
        console.error("Failed to save template", error);
        setErrorMsg(t("saveError"));
      }
    });
  };

  const handleDeleteTemplate = (id: string) => {
    if (isPending) return;
    
    startTransition(async () => {
      try {
        await deleteCustomTemplate(id);
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Failed to delete template", error);
      }
    });
  };
  
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
            {t("appearanceDesc")}
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
              
              {isLowContrast && (
                <div className="flex items-center gap-2 mt-2 text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900/50">
                  <TriangleAlert className="size-4 shrink-0" />
                  <p className="text-xs font-medium">{t("lowContrast", { ratio: contrastRatio.toFixed(1) })}</p>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel>{t("savedTemplates")}</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={newTemplateName}
                  onChange={(e) => {
                    setNewTemplateName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={t("templateName")}
                  className="flex-1"
                  disabled={isPending}
                />
                <Button 
                  onClick={handleSaveTemplate} 
                  disabled={!newTemplateName.trim() || isPending}
                  variant="secondary"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {t("save")}
                </Button>
              </div>

              {errorMsg && (
                <p className="mt-2 text-sm font-medium text-destructive">
                  {errorMsg}
                </p>
              )}
              
              {isFetching ? (
                <div className="mt-4 flex justify-center py-4 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : templates.length > 0 ? (
                <div className="mt-4 flex flex-col gap-2">
                  {templates.map((tmpl) => (
                    <div 
                      key={tmpl.id} 
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="size-4 rounded-full border border-border" style={{ backgroundColor: tmpl.metadata.colors.background }} />
                          <div className="size-4 rounded-full border border-border" style={{ backgroundColor: tmpl.metadata.colors.accents[0] }} />
                        </div>
                        <span className="font-medium truncate max-w-[150px]">{tmpl.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateMetadata(tmpl.metadata)}
                          title={t("apply")}
                          disabled={isPending}
                        >
                          <Check className="size-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(tmpl.id)}
                          title={t("deleteTemplate")}
                          disabled={isPending}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Field>
          </div>
        </DialogPanel>
      </DialogContent>
    </Dialog>
  );
}
