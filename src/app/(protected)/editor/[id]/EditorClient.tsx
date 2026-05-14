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
    is_public: boolean;
    slug: string | null;
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

    // Normalize old date-range values to YYYY-MM format
    const monthNames: Record<string, string> = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
    };
    const normalizeDate = (d: string | undefined, allowUndefined: boolean): string | undefined => {
      if (!d || d === "Present") return allowUndefined ? undefined : "";
      const mm = d.match(/^(\d{4})-(\d{2})$/);
      if (mm) return d;
      const text = d.match(/^([a-z]{3})\s(\d{4})$/i);
      if (text && monthNames[text[1].toLowerCase()])
        return `${text[2]}-${monthNames[text[1].toLowerCase()]}`;
      const yearOnly = d.match(/^(\d{4})$/);
      if (yearOnly) return `${yearOnly[1]}-01`;
      return allowUndefined ? undefined : "";
    };

    const sections = (resumeData.sections ?? []).map((section) => ({
      ...section,
      content: {
        ...section.content,
        items: section.content.items.map((item) => {
          if (item.type === "date-range" && "value" in item && typeof item.value === "object" && item.value) {
            const val = item.value as Record<string, unknown>;
            return {
              ...item,
              value: {
                startDate: normalizeDate(val.startDate as string, false) as string,
                endDate: normalizeDate(val.endDate as string, true),
              },
            };
          }
          return item;
        }),
      },
    }));

    setResume({
      id: initialData.id,
      userId: "",
      title: initialData.title,
      isPublic: initialData.is_public,
      metadata: resumeData.metadata ?? {
        template: "modern",
        typography: { fontFamily: "inter", fontSize: "md" },
        colors: { background: "#ffffff", text: "#1f2937", accents: [] },
      },
      personal: resumeData.personal ?? { fullName: "", details: [] },
      sections,
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
              <Panel id="form-editor" defaultSize="33%" minSize="25%" maxSize="50%">
                <FormEditor 
                  resumeId={resumeId}
                  initialIsPublic={initialData.is_public}
                  initialSlug={initialData.slug}
                />
              </Panel>

              <Separator
                style={{
                  width: "8px",
                  background: "var(--border)",
                  cursor: "col-resize",
                }}
              />

              <Panel id="live-preview" defaultSize="67%" minSize="50%" maxSize="75%">
                <PreviewPanel />
              </Panel>
            </Group>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SaveProvider>
  );
}
