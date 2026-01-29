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
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SettingsIcon,
  LayoutTemplateIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  WrenchIcon,
  TextIcon,
  PlusIcon,
  HomeIcon,
} from "lucide-react";
import { useResumeStore, SECTION_TEMPLATES } from "@/stores/useResumeStore";
import { RESUME_LIMITS } from "@/constants/limits";

export function EditorSidebar() {
  const t = useTranslations("editor.sidebar");
  const tForm = useTranslations("editor.formEditor");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const sectionCount = useResumeStore((state) => state.resume.sections.length);
  const atSectionLimit = sectionCount >= RESUME_LIMITS.MAX_SECTIONS;

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-e overflow-x-hidden">
        <SidebarHeader className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" isActive={false}>
                <Avatar className="size-8">
                  <div className="flex size-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                    JD
                  </div>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{t("user")}</span>
                  <span className="text-xs text-muted-foreground">
                    john@example.com
                  </span>
                </div>
              </SidebarMenuButton>
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
              {Object.entries(SECTION_TEMPLATES).map(([key, template]) => {
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
                        onClick={() => useResumeStore.getState().addSection(key)}
                        disabled={atSectionLimit}
                        className="justify-start w-full"
                      >
                        <Icon className="size-4 mr-2" />
                        {template.title}
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
              <SidebarMenuButton tooltip={isCollapsed ? t("settings") : undefined}>
                <SettingsIcon />
                <span>{t("settings")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger className="w-full" />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
