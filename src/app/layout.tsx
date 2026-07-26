import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from "next/headers";
import { AriaLiveRegion } from "@/components/AriaLiveRegion";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civy - Resume Builder",
  description: "Build your professional resume with ease",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo-32.ico", sizes: "32x32" },
    ],
    apple: "/logo-64.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  let initialTheme: "light" | "dark" | "system" = "system";
  try {
    const cookieStore = await cookies();
    const cookieTheme = cookieStore.get("NEXT_THEME")?.value;
    if (cookieTheme === "light" || cookieTheme === "dark" || cookieTheme === "system") {
      initialTheme = cookieTheme;
    }
  } catch {
  }

  // Determine text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Prevent flash of incorrect theme (FOUC)
  const scriptStr = `
    let theme = '${initialTheme}';
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(theme);
  `;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptStr }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider initialTheme={initialTheme}>
          <NextIntlClientProvider messages={messages}>
            <ToastProvider>
              {children}
              <AriaLiveRegion />
            </ToastProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
