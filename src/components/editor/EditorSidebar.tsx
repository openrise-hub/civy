"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplateIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  WrenchIcon,
  TextIcon,
  PlusIcon,
  HomeIcon,
  HistoryIcon,
} from "lucide-react";
import { useResumeStore, SECTION_TEMPLATES } from "@/stores/useResumeStore";
import { RESUME_LIMITS } from "@/constants/limits";
import { useUser } from "@/contexts/UserContext";
import { VersionHistory } from "@/components/editor/VersionHistory";
import { ResumeSettingsDialog } from "@/components/editor/ResumeSettingsDialog";
import { UserNav } from "@/components/UserNav";
import { LanguageToggle } from "@/components/LanguageToggle";

export function EditorSidebar() {
  const t = useTranslations("editor.sidebar");
  const tForm = useTranslations("editor.formEditor");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const sectionCount = useResumeStore((state) => state.resume.sections.length);
  const resumeId = useResumeStore((state) => state.resume.id);
  const atSectionLimit = sectionCount >= RESUME_LIMITS.MAX_SECTIONS;
  const { user } = useUser();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-e overflow-x-hidden">
        <SidebarHeader className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <UserNav />
                  {!isCollapsed && (
                     <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-sm">
                       <span className="font-semibold truncate max-w-32">{t("user")}</span>
                       <span className="text-xs text-muted-foreground truncate max-w-32">{user?.user_metadata?.display_name || user?.email || "Unknown"}</span>
                     </div>
                  )}
                </div>
                {!isCollapsed && <LanguageToggle />}
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={isCollapsed ? "Dashboard" : undefined}
                render={<Link href="/dashboard" />}
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
                  <SidebarMenuButton tooltip={isCollapsed ? t("sections") : undefined}>
                    <FileTextIcon />
                    <span>{t("sections")}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={isCollapsed ? t("templates") : undefined}>
                    <LayoutTemplateIcon />
                    <span>{t("templates")}</span>
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

          <SidebarTrigger className="w-full" />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
