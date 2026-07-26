"use client";

import dynamic from "next/dynamic";
import { ThinkingOrb } from "thinking-orbs";

const EditorClient = dynamic(
  () => import("./EditorClient").then((mod) => ({ default: mod.EditorClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-dvh bg-background">
        <ThinkingOrb state="working" size={64} aria-label="Loading editor" />
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
