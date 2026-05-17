"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleResumeVisibility, regenerateSlug } from "@/lib/resumes/actions";
import { toastManager } from "@/components/ui/toast";
import { 
  ShareIcon, 
  CopyIcon, 
  CheckIcon, 
  RefreshCwIcon, 
  GlobeIcon,
  LockIcon,
} from "lucide-react";

type ShareModalProps = {
  resumeId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
  iconOnly?: boolean;
};

export function ShareModal({ 
  resumeId, 
  initialIsPublic, 
  initialSlug,
  iconOnly,
}: ShareModalProps) {
  const t = useTranslations("share");
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync with props
  useEffect(() => {
    setIsPublic(initialIsPublic);
    setSlug(initialSlug);
  }, [initialIsPublic, initialSlug]);

  const shareUrl = slug 
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`
    : "";

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleResumeVisibility(resumeId);
      if (result.error) {
        toastManager.add({
          type: "error",
          title: result.error,
        });
      } else {
        setIsPublic(result.isPublic);
        setSlug(result.slug);
        toastManager.add({
          type: "success",
          title: result.isPublic ? t("nowPublic") : t("nowPrivate"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const result = await regenerateSlug(resumeId);
      if (result.error) {
        toastManager.add({
          type: "error",
          title: result.error,
        });
      } else {
        setSlug(result.slug);
        toastManager.add({
          type: "success",
          title: t("linkRegenerated"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toastManager.add({
      type: "success",
      title: t("copied"),
    });
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <ShareIcon className="size-4" />
        {!iconOnly && <span>{t("title")}</span>}
      </DialogTrigger>

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {isPublic ? t("publicDescription") : t("privateDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="space-y-6">
            {/* Toggle */}
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <GlobeIcon className="size-5 text-green-500" />
                ) : (
                  <LockIcon className="size-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="public-toggle" className="font-medium">
                    {t("makePublic")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublic ? t("publicDescription") : t("privateDescription")}
                  </p>
                </div>
              </div>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={handleToggle}
                disabled={isLoading}
              />
            </div>

            {/* Share URL (only when public) */}
            {isPublic && slug && (
              <div className="space-y-3">
                <Label>{t("shareLink")}</Label>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={shareUrl}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    aria-label={t("copyLink")}
                  >
                    {copied ? (
                      <CheckIcon className="size-4 text-green-500" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </Button>
                </div>
                
                {/* Regenerate link */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="text-muted-foreground"
                >
                  <RefreshCwIcon className="size-4" />
                  {t("regenerate")}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t("regenerateWarning")}
                </p>
              </div>
            )}
          </div>
        </DialogPanel>

        <DialogFooter variant="bare">
          <DialogClose render={<Button variant="outline" />}>
            {t("close")}
          </DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
