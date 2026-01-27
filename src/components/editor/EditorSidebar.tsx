"use client";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import {
  UserIcon,
  SettingsIcon,
  LayoutTemplateIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  WrenchIcon,
  TextIcon,
  PlusIcon,
} from "lucide-react";

const NAV_SECTIONS = [
  { key: "experience", icon: BriefcaseIcon },
  { key: "education", icon: GraduationCapIcon },
  { key: "skills", icon: WrenchIcon },
  { key: "summary", icon: TextIcon },
] as const;

export function EditorSidebar() {
  const t = useTranslations("editor.sidebar");
  const tForm = useTranslations("editor.formEditor");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
              <SidebarMenu>
                {NAV_SECTIONS.map(({ key, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton tooltip={isCollapsed ? tForm(key) : undefined}>
                      <Icon />
                      <span>{tForm(key)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={isCollapsed ? tForm("addSection") : undefined}>
                    <PlusIcon />
                    <span>{tForm("addSection")}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
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
