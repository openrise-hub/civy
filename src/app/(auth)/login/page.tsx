"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Linkedin } from "lucide-react";
import { 
  signInWithOAuth, 
  signInWithEmail, 
  signUpWithEmail,
  type OAuthProvider 
} from "@/lib/auth/actions";

// Brand SVG Icons - grayscale by default, colored on hover
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
    <path className="fill-current group-hover:fill-[#FFC107]" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path className="fill-current group-hover:fill-[#FF3D00]" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path className="fill-current group-hover:fill-[#4CAF50]" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path className="fill-current group-hover:fill-[#1976D2]" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="size-5 fill-current group-hover:fill-black">
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
    <path className="fill-current group-hover:fill-[#8c9eff]" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
    <path className="fill-current group-hover:fill-[#ff5722]" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"/>
    <path className="fill-current group-hover:fill-[#4caf50]" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"/>
    <path className="fill-current group-hover:fill-[#ffc107]" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"/>
    <path className="fill-current group-hover:fill-[#03a9f4]" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"/>
  </svg>
);

const SlackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
    <path className="fill-current group-hover:fill-[#33d375]" d="M33,8c0-2.209-1.791-4-4-4s-4,1.791-4,4c0,1.254,0,9.741,0,11c0,2.209,1.791,4,4,4s4-1.791,4-4C33,17.741,33,9.254,33,8z"/>
    <path className="fill-current group-hover:fill-[#33d375]" d="M43,19c0,2.209-1.791,4-4,4c-1.195,0-4,0-4,0s0-2.986,0-4c0-2.209,1.791-4,4-4S43,16.791,43,19z"/>
    <path className="fill-current group-hover:fill-[#40c4ff]" d="M8,14c-2.209,0-4,1.791-4,4s1.791,4,4,4c1.254,0,9.741,0,11,0c2.209,0,4-1.791,4-4s-1.791-4-4-4C17.741,14,9.254,14,8,14z"/>
    <path className="fill-current group-hover:fill-[#40c4ff]" d="M19,4c2.209,0,4,1.791,4,4c0,1.195,0,4,0,4s-2.986,0-4,0c-2.209,0-4-1.791-4-4S16.791,4,19,4z"/>
    <path className="fill-current group-hover:fill-[#e91e63]" d="M14,39.006C14,41.212,15.791,43,18,43s4-1.788,4-3.994c0-1.252,0-9.727,0-10.984c0-2.206-1.791-3.994-4-3.994s-4,1.788-4,3.994C14,29.279,14,37.754,14,39.006z"/>
    <path className="fill-current group-hover:fill-[#e91e63]" d="M4,28.022c0-2.206,1.791-3.994,4-3.994c1.195,0,4,0,4,0s0,2.981,0,3.994c0,2.206-1.791,3.994-4,3.994S4,30.228,4,28.022z"/>
    <path className="fill-current group-hover:fill-[#ffc107]" d="M39,33c2.209,0,4-1.791,4-4s-1.791-4-4-4c-1.254,0-9.741,0-11,0c-2.209,0-4,1.791-4,4s1.791,4,4,4C29.258,33,37.746,33,39,33z"/>
    <path className="fill-current group-hover:fill-[#ffc107]" d="M28,43c-2.209,0-4-1.791-4-4c0-1.195,0-4,0-4s2.986,0,4,0c2.209,0,4,1.791,4,4S30.209,43,28,43z"/>
  </svg>
);

const LinkedInIcon = () => (
  <Linkedin className="size-5 group-hover:text-[#0A66C2]" />
);

const oauthProviders: { id: OAuthProvider; name: string; icon: React.ReactNode }[] = [
  { id: "google", name: "Google", icon: <GoogleIcon /> },
  { id: "github", name: "GitHub", icon: <GitHubIcon /> },
  { id: "discord", name: "Discord", icon: <DiscordIcon /> },
  { id: "linkedin_oidc", name: "LinkedIn", icon: <LinkedInIcon /> },
  { id: "azure", name: "Microsoft", icon: <MicrosoftIcon /> },
  { id: "slack_oidc", name: "Slack", icon: <SlackIcon /> },
];

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || undefined;
  const errorParam = searchParams.get("error");
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(errorParam);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: OAuthProvider) => {
    setLoading(true);
    setError(null);
    const result = await signInWithOAuth(provider, next);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await signInWithEmail(email, password, next);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await signUpWithEmail(email, password, next);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setMessage(t("checkEmail"));
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{t("welcome")}</h1>
        <p className="text-muted-foreground">{t("signInToAccount")}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
          {message}
        </div>
      )}

      {/* OAuth Buttons - Icon buttons with hover color effect */}
      <div className="flex justify-center gap-2">
        {oauthProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            size="icon"
            onClick={() => handleOAuth(provider.id)}
            disabled={loading}
            aria-label={t("signInWith", { provider: provider.name })}
            className="group"
          >
            {provider.icon}
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("orContinueWithEmail")}
          </span>
        </div>
      </div>

      {/* Email/Password Tabs */}
      <Tabs defaultValue="signin">
        <TabsList className="w-full">
          <TabsTab value="signin" className="flex-1">{t("signIn")}</TabsTab>
          <TabsTab value="signup" className="flex-1">{t("signUp")}</TabsTab>
        </TabsList>

        <TabsPanel value="signin" className="mt-4">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <Field>
              <FieldLabel>{t("email")}</FieldLabel>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel>{t("password")}</FieldLabel>
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
        </TabsPanel>

        <TabsPanel value="signup" className="mt-4">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <Field>
              <FieldLabel>{t("email")}</FieldLabel>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel>{t("password")}</FieldLabel>
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("creatingAccount") : t("signUp")}
            </Button>
          </form>
        </TabsPanel>
      </Tabs>
    </div>
  );
}

function LoginFormFallback() {
  const t = useTranslations("common");
  return <div className="text-center text-muted-foreground">{t("loading")}</div>;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh">
      {/* Left Panel - Login Form (33% on desktop, 100% on mobile) */}
      <div className="w-full md:w-1/3 flex flex-col justify-center p-8 bg-background">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Panel - Placeholder (66% on desktop, hidden on mobile) */}
      <div className="hidden md:flex md:w-2/3 bg-muted items-center justify-center">
        {/* Content to be added */}
      </div>
    </div>
  );
}
