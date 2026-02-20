"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { CrownIcon, CheckIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeSubscriptionTier } from "@/lib/profile/actions";

type PricingTier = "monthly" | "quarterly" | "yearly";

const PRICING = {
  monthly: { price: 3.99, label: "Monthly", cycle: "monthly" },
  quarterly: { price: 9.99, label: "3 Months", cycle: "every 3 months" },
  yearly: { price: 29.99, label: "Yearly", cycle: "yearly" },
} as const;

const FEATURES = [
  "Unlimited resumes",
  "All premium templates",
  "Resume version history",
  "Priority support",
];

type UpgradeModalProps = {
  trigger?: React.ReactElement;
  isPremium?: boolean;
  currentTier?: PricingTier | null;
};

export function UpgradeModal({ trigger, isPremium, currentTier }: UpgradeModalProps) {
  const t = useTranslations("premium");
  const [selectedTier, setSelectedTier] = useState<PricingTier>("yearly");
  const [isProcessing, setIsProcessing] = useState(false);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    console.warn("NEXT_PUBLIC_PAYPAL_CLIENT_ID not set");
  }

  const isChangingPlan = isPremium && currentTier;
  const canChangePlan = isChangingPlan && selectedTier !== currentTier;

  const handleApprove = async (subscriptionId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/paypal/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, tier: selectedTier }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate subscription");
      }

      toastManager.add({
        type: "success",
        title: "Welcome to Pro!",
        description: "Your subscription is now active.",
      });

      window.location.reload();
    } catch {
      toastManager.add({
        type: "error",
        title: "Subscription failed",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePlan = async () => {
    setIsProcessing(true);
    try {
      const result = await changeSubscriptionTier(selectedTier);

      if (result.error) {
        toastManager.add({ type: "error", title: result.error });
        return;
      }

      if (result.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = result.approvalUrl;
      } else {
        toastManager.add({
          type: "success",
          title: t("planChanged"),
        });
        window.location.reload();
      }
    } catch {
      toastManager.add({
        type: "error",
        title: "Failed to change plan",
        description: "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={trigger ?? <Button variant="default" />}>
        <CrownIcon className="size-4" />
        {isChangingPlan ? t("changePlan") : t("title")}
      </DialogTrigger>

      <DialogPopup className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-yellow-500" />
            {isChangingPlan ? t("changePlan") : t("title")}
          </DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="space-y-6">
            {/* Pricing Cards */}
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(PRICING) as [PricingTier, typeof PRICING.monthly][]).map(
                ([tier, { price, label, cycle }]) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition-all",
                      selectedTier === tier
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50",
                      isChangingPlan && tier === currentTier && "opacity-60"
                    )}
                  >
                    {tier === "yearly" && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        BEST VALUE
                      </span>
                    )}
                    {isChangingPlan && tier === currentTier && (
                      <span className="absolute -top-2.5 right-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                        {t("currentTier")}
                      </span>
                    )}
                    <div className="text-sm font-medium">{label}</div>
                    <div className="mt-1 text-2xl font-bold">${price}</div>
                    <div className="text-xs text-muted-foreground">
                      Billed {cycle}
                    </div>
                  </button>
                )
              )}
            </div>

            {/* Features */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="mb-3 text-sm font-medium">What you get:</h4>
              <ul className="space-y-2">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckIcon className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Change Plan Button (for existing subscribers) */}
            {isChangingPlan && (
              <Button
                onClick={handleChangePlan}
                disabled={!canChangePlan || isProcessing}
                className="w-full"
              >
                {isProcessing
                  ? "Processing..."
                  : canChangePlan
                    ? t("changePlan")
                    : t("currentTier")}
              </Button>
            )}

            {/* PayPal Button (for new subscribers) */}
            {!isChangingPlan && paypalClientId && (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  vault: true,
                  intent: "subscription",
                }}
              >
                <PayPalButtons
                  style={{
                    shape: "rect",
                    color: "gold",
                    layout: "vertical",
                    label: "subscribe",
                  }}
                  disabled={isProcessing}
                  createSubscription={(data, actions) => {
                    const planIds: Record<PricingTier, string> = {
                      monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY || "",
                      quarterly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_QUARTERLY || "",
                      yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_YEARLY || "",
                    };

                    return actions.subscription.create({
                      plan_id: planIds[selectedTier],
                    });
                  }}
                  onApprove={async (data) => {
                    if (data.subscriptionID) {
                      await handleApprove(data.subscriptionID);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    toastManager.add({
                      type: "error",
                      title: "Payment error",
                      description: "Please try again.",
                    });
                  }}
                />
              </PayPalScriptProvider>
            )}

            {!isChangingPlan && !paypalClientId && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                PayPal not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local
              </div>
            )}
          </div>
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
