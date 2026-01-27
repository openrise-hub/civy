"use client";

import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useResumeStore } from "@/stores/useResumeStore";
import { PlusIcon } from "lucide-react";

export function FormEditor() {
  const t = useTranslations("editor.formEditor");
  const { resume, addSection } = useResumeStore();

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <Button size="sm" variant="outline" onClick={() => addSection("custom")}>
          <PlusIcon className="size-4" />
          <span>{t("addSection")}</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Personal Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("personal")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {resume.personal.fullName}
              </div>
              {resume.personal.details.map((item) => (
                <div key={item.id} className="text-sm text-muted-foreground">
                  {item.type}: {String(item.value)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Dynamic Sections */}
          {resume.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.content.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    {t("addSection")}
                  </p>
                ) : (
                  section.content.items.map((item) => (
                    <div
                      key={item.id}
                      className="text-sm p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span className="text-xs text-muted-foreground uppercase">
                        {item.type}
                      </span>
                      <div>
                        {typeof item.value === "string"
                          ? item.value
                          : JSON.stringify(item.value)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
