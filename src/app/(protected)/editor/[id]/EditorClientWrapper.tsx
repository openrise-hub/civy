"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const EditorClient = dynamic(
  () => import("./EditorClient").then((mod) => ({ default: mod.EditorClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-dvh bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

type EditorClientWrapperProps = {
  resumeId: string;
  initialData: {
    id: string;
    title: string;
    data: Record<string, unknown>;
    is_public: boolean;
    slug: string | null;
  };
};

export function EditorClientWrapper({ resumeId, initialData }: EditorClientWrapperProps) {
  return <EditorClient resumeId={resumeId} initialData={initialData} />;
}
