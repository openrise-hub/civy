"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  WrenchIcon,
  TextIcon,
  PlusIcon,
  HomeIcon,
  HistoryIcon,
  SparklesIcon,
} from "lucide-react";
import { useResumeStore, SECTION_TEMPLATES } from "@/stores/useResumeStore";
import type { Resume } from "@/types/resume";
import { RESUME_LIMITS } from "@/constants/limits";
import { createJohnDoeResume } from "@/lib/sample-data";
import { useUser } from "@/contexts/UserContext";
import { useSave } from "@/contexts/SaveContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from "@/components/ui/dialog";
import { VersionHistory } from "@/components/editor/VersionHistory";
import { ResumeSettingsDialog } from "@/components/editor/ResumeSettingsDialog";
import { TemplatePicker } from "@/components/editor/TemplatePicker";
import { SectionGuide } from "@/components/editor/SectionGuide";
import { UserNav } from "@/components/UserNav";

export function EditorSidebar() {
  const t = useTranslations("editor.sidebar");
  const tForm = useTranslations("editor.formEditor");
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const sectionCount = useResumeStore((state) => state.resume.sections.length);
  const resumeId = useResumeStore((state) => state.resume.id);
  const atSectionLimit = sectionCount >= RESUME_LIMITS.MAX_SECTIONS;
  const { user } = useUser();
  const setResume = useResumeStore((state) => state.setResume);
  const { saveNow, isDirty } = useSave();
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const resume = useResumeStore((state) => state.resume);

  const handleAutoPopulate = () => {
    const sample = createJohnDoeResume(resume.metadata.template || "modern");
    setResume({
      ...resume,
      id: resume.id,
      userId: resume.userId,
      title: resume.title || "My First Resume",
      isPublic: resume.isPublic,
      personal: sample.personal || resume.personal,
      sections: (sample.sections as Resume["sections"]) || resume.sections,
      metadata: {
        ...resume.metadata,
        ...(sample.metadata || {}),
      } as Resume["metadata"],
      createdAt: resume.createdAt,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-e">
        <SidebarHeader className="p-2">
          <SidebarMenu>
              <SidebarMenuItem>
                    <div className={cn(
                      "flex items-center px-2 py-1",
                      isCollapsed ? "justify-center" : "justify-between"
                    )}>
                      <div className="flex items-center gap-2">
                        {!isCollapsed && <UserNav />}
                        {!isCollapsed && (
                          <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-sm">
                            <span className="font-semibold truncate max-w-32">{t("user")}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-32">{user?.user_metadata?.display_name || user?.email || "Unknown"}</span>
                          </div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleSidebar}
                          className="size-8 rounded-lg hover:bg-accent"
                          aria-label="Toggle Sidebar"
                        >
                          <PanelLeftClose className="size-4" />
                        </Button>
                      )}
                    </div>
                  </SidebarMenuItem>
                  {isCollapsed && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={toggleSidebar}
                        tooltip="Toggle Sidebar"
                      >
                        <PanelLeftOpen className="size-4" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={isCollapsed ? "Dashboard" : undefined}
                onClick={() => {
                  if (isDirty) {
                    setNavTarget("/dashboard");
                  } else {
                    window.location.href = "/dashboard";
                  }
                }}
              >
                <HomeIcon className="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SectionGuide isCollapsed={isCollapsed} />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <TemplatePicker isCollapsed={isCollapsed} />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={isCollapsed ? t("autoPopulate") : undefined}
                    onClick={handleAutoPopulate}
                  >
                    <SparklesIcon />
                    <span>{t("autoPopulate")}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

<SidebarGroup>
            <SidebarGroupLabel>{t("sections")}</SidebarGroupLabel>
            <SidebarGroupContent>
              {/* Add Section Buttons */}
              {!isCollapsed && (
                <div className="space-y-1">
              {Object.keys(SECTION_TEMPLATES).map((key) => {
                    const iconMap = {
                      experience: BriefcaseIcon,
                      education: GraduationCapIcon,
                      skills: WrenchIcon,
                      summary: TextIcon,
                      custom: PlusIcon,
                    };
                    const Icon = iconMap[key as keyof typeof iconMap];
                    return (
                      <Button
                        key={key}
                        variant="ghost"
                        size="sm"
                        onClick={() => useResumeStore.getState().addSection(key, tForm(key))}
                        disabled={atSectionLimit}
                        className="justify-start w-full"
                      >
                        <Icon className="size-4 mr-2" />
                        {tForm(key)}
                      </Button>
                    );
                  })}
                  {atSectionLimit && (
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      Maximum {RESUME_LIMITS.MAX_SECTIONS} sections
                    </p>
                  )}
                </div>
              )}

              {/* Collapsed Add Button */}
              {isCollapsed && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={tForm("addSection")}>
                      <PlusIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <VersionHistory
                resumeId={resumeId}
                trigger={
                  <SidebarMenuButton tooltip={isCollapsed ? t("versionHistory") : undefined}>
                    <HistoryIcon />
                    <span>{t("versionHistory")}</span>
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ResumeSettingsDialog isCollapsed={isCollapsed} />
            </SidebarMenuItem>
          </SidebarMenu>

        </SidebarFooter>
      </Sidebar>

      <Dialog open={navTarget !== null} onOpenChange={(open) => { if (!open) setNavTarget(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setNavTarget(null); }}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {
              const target = navTarget;
              setNavTarget(null);
              window.location.href = target || "/dashboard";
            }}>
              Discard
            </Button>
            <Button onClick={async () => {
              await saveNow();
              const target = navTarget;
              setNavTarget(null);
              window.location.href = target || "/dashboard";
            }}>
              Save & leave
            </Button>
          </DialogPanel>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
