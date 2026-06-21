import { getRequestConfig } from "next-intl/server";
import { getProfile } from "@/lib/profile/actions";
import { cookies, headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "es", "fr", "pt", "ru", "zh", "hi", "ar", "bn"];

export default getRequestConfig(async () => {
  let locale = "en";
  try {
    const profile = await getProfile();
    if (profile?.locale && SUPPORTED_LOCALES.includes(profile.locale)) {
      locale = profile.locale;
    } else {
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
      if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
        locale = cookieLocale;
      } else {
        const acceptLanguage = (await headers()).get("accept-language");
        if (acceptLanguage) {
          const preferred = acceptLanguage
            .split(",")
            .map((l) => l.split(";")[0].trim().split("-")[0])
            .find((l) => SUPPORTED_LOCALES.includes(l));
          if (preferred) locale = preferred;
        }
      }
    }
  } catch {
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
