"use client";

import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/UserContext";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { profile } = useUser();
  const t = useTranslations("settings");
  
  const handleLanguageChange = async (locale: "en" | "es") => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    await import("@/lib/profile/actions").then((m) =>
      m.updatePreferences({ locale })
    );
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <Languages className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          {t("english")} {profile?.locale === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
          {t("spanish")} {profile?.locale === "es" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
