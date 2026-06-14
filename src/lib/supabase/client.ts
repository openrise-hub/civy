import { createBrowserClient } from "@supabase/ssr";

function parseCookieValue(cookie: string) {
  return cookie.includes("%") ? decodeURIComponent(cookie) : cookie;
}

function cookieToString({ name, value, options }: {
  name: string;
  value: string;
  options?: { domain?: string; path?: string; maxAge?: number; sameSite?: string | boolean; secure?: boolean };
}) {
  let cookie = `${name}=${encodeURIComponent(value ?? "")}`;
  if (options?.path) cookie += `; path=${options.path}`;
  if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
  if (options?.domain) cookie += `; domain=${options.domain}`;
  if (options?.sameSite) cookie += `; samesite=${String(options.sameSite).toLowerCase()}`;
  if (options?.secure) cookie += `; secure`;
  return cookie;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLISHABLE_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === "undefined") return [];
          return document.cookie
            .split("; ")
            .filter(Boolean)
            .map((c) => {
              const eq = c.indexOf("=");
              if (eq === -1) return { name: c.trim(), value: "" };
              const name = c.substring(0, eq).trim();
              const rawValue = c.substring(eq + 1);
              return { name, value: parseCookieValue(rawValue) };
            });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((item) => {
            document.cookie = cookieToString(item);
          });
        },
      },
    }
  );
}
