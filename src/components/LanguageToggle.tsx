"use client";

import { useUser } from "@/contexts/UserContext";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

const LOCALES = ["en", "es", "fr", "pt", "ru", "zh", "hi", "ar", "bn"] as const;
type Locale = (typeof LOCALES)[number];

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  hi: "हिन्दी",
  ar: "العربية",
  bn: "বাংলা",
};

export function LanguageToggle() {
  const { profile } = useUser();
  
  const handleLanguageChange = async (locale: Locale) => {
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
        {LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => handleLanguageChange(locale)}>
            {LOCALE_LABELS[locale]} {profile?.locale === locale && "✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
