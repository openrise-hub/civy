"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { resetPassword, updatePassword } from "@/lib/auth/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth");

  // If the user arrived via a reset link, Supabase has already exchanged
  // the token in the callback route so the user wouyld have a valid session.
  const isRecovered = searchParams.get("recovered") === "true";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage(t("passwordResetSent"));
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    const result = await updatePassword(newPassword);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage(t("passwordResetSuccess"));
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{t("resetPassword")}</h1>
        <p className="text-muted-foreground">
          {isRecovered
            ? t("enterNewPassword")
            : t("resetPasswordDescription")}
        </p>
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

      {isRecovered ? (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Field>
            <FieldLabel>{t("newPassword")}</FieldLabel>
            <Input
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </Field>
          <Field>
            <FieldLabel>{t("confirmPassword")}</FieldLabel>
            <Input
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("saving") : t("resetPassword")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("sending") : t("sendResetLink")}
          </Button>
        </form>
      )}

      <div className="text-center">
        <Button variant="link" render={<Link href="/login" />}>
          <ArrowLeft className="size-4" />
          {t("backToLogin")}
        </Button>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  const t = useTranslations("common");
  return <div className="text-center text-muted-foreground">{t("loading")}</div>;
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-8">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
