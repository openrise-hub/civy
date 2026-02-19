"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, User, Shield, CreditCard, AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toastManager } from "@/components/ui/toast";
import { useUser } from "@/contexts/UserContext";
import { updatePassword } from "@/lib/auth/actions";
import { updateDisplayName, cancelSubscription } from "@/lib/profile/actions";

export default function SettingsPage() {
  const { user, profile, isPremium } = useUser();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const router = useRouter();

  // --- Profile Section ---
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [profilePending, startProfileTransition] = useTransition();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startProfileTransition(async () => {
      const result = await updateDisplayName(displayName);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("savedSuccess") });
        router.refresh();
      }
    });
  };

  // --- Security Section ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityPending, startSecurityTransition] = useTransition();

  const isEmailUser = user?.app_metadata?.provider === "email";

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastManager.add({ type: "error", title: t("passwordMismatch") });
      return;
    }
    startSecurityTransition(async () => {
      const result = await updatePassword(newPassword);
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("passwordChanged") });
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  // --- Subscription Section ---
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelPending, startCancelTransition] = useTransition();

  const handleCancelSubscription = () => {
    startCancelTransition(async () => {
      const result = await cancelSubscription();
      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
      } else {
        toastManager.add({ type: "success", title: t("subscriptionCanceled") });
        setShowCancelConfirm(false);
        router.refresh();
      }
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            render={<Link href="/dashboard" />}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-muted-foreground" />
                <CardTitle>{t("profile")}</CardTitle>
              </div>
              <CardDescription>{t("profileDescription")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>{t("displayName")}</FieldLabel>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t("displayNamePlaceholder")}
                    maxLength={100}
                  />
                </Field>
                <Field>
                  <FieldLabel>{t("emailReadOnly")}</FieldLabel>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="opacity-64"
                  />
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={profilePending}>
                  {profilePending ? t("saving") : tCommon("save")}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security Section — only for email/password users */}
          {isEmailUser && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-muted-foreground" />
                  <CardTitle>{t("security")}</CardTitle>
                </div>
                <CardDescription>{t("securityDescription")}</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel>{t("newPassword")}</FieldLabel>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t("confirmPassword")}</FieldLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </Field>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={securityPending}>
                    {securityPending ? t("saving") : t("changePassword")}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Subscription Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-muted-foreground" />
                <CardTitle>{t("subscription")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("currentPlan")}</span>
                <span className="font-medium">
                  {isPremium ? `Pro (${profile?.premium_tier || "—"})` : t("freePlan")}
                </span>
              </div>
              {isPremium && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("renewsOn")}</span>
                  <span className="text-sm">
                    {formatDate(profile?.premium_until ?? null)}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isPremium ? (
                showCancelConfirm ? (
                  <div className="flex w-full items-center gap-2">
                    <span className="text-sm text-destructive">{t("cancelConfirm")}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={cancelPending}
                    >
                      {cancelPending ? t("canceling") : t("confirmCancel")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCancelConfirm(false)}
                      disabled={cancelPending}
                    >
                      {tCommon("cancel")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    {t("cancelSubscription")}
                  </Button>
                )
              ) : (
                <Button render={<Link href="/upgrade" />}>
                  {t("upgradeToPro")}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                <CardTitle className="text-destructive">{t("dangerZone")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("deleteAccountPlaceholder")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
