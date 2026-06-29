export const SUPPORTED_LOCALES = ["en", "es", "fr", "pt", "ru", "zh", "hi", "ar", "bn"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
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
