import { getRequestConfig } from "next-intl/server";
import { getProfile } from "@/lib/profile/actions";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "es"];

export default getRequestConfig(async () => {
  // 1. Try to get locale from authenticated user profile
  let locale = "en";
  try {
    const profile = await getProfile();
    if (profile?.locale && SUPPORTED_LOCALES.includes(profile.locale)) {
      locale = profile.locale;
    } else {
      // 2. Fallback to cookie
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
      if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
        locale = cookieLocale;
      }
    }
  } catch {
    // Ignore errors and default to 'en'
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
