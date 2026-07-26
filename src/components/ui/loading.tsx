"use client";

import { ThinkingOrb } from "thinking-orbs";

const ORB_SIZES = { sm: 20, md: 20, lg: 64 } as const;

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <ThinkingOrb state="working" size={ORB_SIZES[size]} aria-label="Loading" />;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ThinkingOrb state="working" size={64} aria-label="Loading page" />
    </div>
  );
}
