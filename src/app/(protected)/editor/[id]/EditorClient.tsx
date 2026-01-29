"use client";

import { useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { FormEditor } from "@/components/editor/FormEditor";
import { PreviewPanel } from "@/components/editor/PreviewPanel";
import { useResumeStore } from "@/stores/useResumeStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { SaveProvider } from "@/contexts/SaveContext";
import type { Resume } from "@/types/resume";

type EditorClientProps = {
  resumeId: string;
  initialData: {
    id: string;
    title: string;
    data: Record<string, unknown>;
  };
};

export function EditorClient({ resumeId, initialData }: EditorClientProps) {
  const setResume = useResumeStore((state) => state.setResume);

  // Hydrate store with data from server
  useEffect(() => {
    const resumeData = initialData.data as {
      metadata?: Resume["metadata"];
      personal?: Resume["personal"];
      sections?: Resume["sections"];
    };

    setResume({
      id: initialData.id,
      userId: "",
      title: initialData.title,
      isPublic: false,
      metadata: resumeData.metadata ?? {
        template: "modern",
        typography: { fontFamily: "inter", fontSize: "md" },
        colors: { background: "#ffffff", text: "#1f2937", accents: [] },
      },
      personal: resumeData.personal ?? { fullName: "", details: [] },
      sections: resumeData.sections ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [initialData, setResume]);

  // Enable auto-save and get manual save function
  const { saveNow } = useAutoSave(resumeId);

  return (
    <SaveProvider saveNow={saveNow}>
      <SidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden">
          <EditorSidebar />

          <SidebarInset className="flex-1 overflow-hidden">
            <Group orientation="horizontal" style={{ height: "100%" }}>
              <Panel id="form-editor" defaultSize="50%" minSize="30%" maxSize="70%">
                <FormEditor />
              </Panel>

              <Separator
                style={{
                  width: "8px",
                  background: "var(--border)",
                  cursor: "col-resize",
                }}
              />

              <Panel id="live-preview" defaultSize="50%" minSize="20%" maxSize="70%">
                <PreviewPanel />
              </Panel>
            </Group>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SaveProvider>
  );
}
