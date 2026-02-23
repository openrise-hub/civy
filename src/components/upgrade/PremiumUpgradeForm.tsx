"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeSubscriptionTier, getPricingPlans } from "@/lib/profile/actions";

export type PricingTier = "monthly" | "quarterly" | "yearly";

// Base config for labels and cycles
const PLAN_CONFIG = {
  monthly: { label: "Monthly", cycle: "monthly" },
  quarterly: { label: "3 Months", cycle: "every 3 months" },
  yearly: { label: "Yearly", cycle: "yearly" },
} as const;

export const FEATURES = [
  "Unlimited resumes",
  "All premium templates",
  "Resume version history",
  "Priority support",
];

type PremiumUpgradeFormProps = {
  isPremium?: boolean;
  currentTier?: PricingTier | null;
  onSuccess?: () => void;
};

export function PremiumUpgradeForm({ isPremium, currentTier, onSuccess }: PremiumUpgradeFormProps) {
  const t = useTranslations("premium");
  const [selectedTier, setSelectedTier] = useState<PricingTier>("yearly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricing, setPricing] = useState<Record<PricingTier, string> | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPricingPlans().then((data) => {
      if (isMounted && data) {
        setPricing(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
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
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
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
    <div className="space-y-6">
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.entries(PLAN_CONFIG) as [PricingTier, typeof PLAN_CONFIG.monthly][]).map(
          ([tier, { label, cycle }]) => (
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
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-max rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  BEST VALUE
                </span>
              )}
              {isChangingPlan && tier === currentTier && (
                <span className="absolute -top-2.5 right-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                  {t("currentTier")}
                </span>
              )}
              <div className="text-sm font-medium">{label}</div>
              <div className="mt-1 text-2xl font-bold">
                {pricing ? `$${pricing[tier]}` : "..."}
              </div>
              <div className="text-xs text-muted-foreground w-max">
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
          <div className="min-h-[150px]">
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
          </div>
        </PayPalScriptProvider>
      )}

      {!isChangingPlan && !paypalClientId && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          PayPal not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local
        </div>
      )}
    </div>
  );
}
