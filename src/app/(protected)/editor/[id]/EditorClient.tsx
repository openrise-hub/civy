"use client";

import { useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { FormEditor } from "@/components/editor/FormEditor";
import { PreviewPanel } from "@/components/editor/PreviewPanel";
import { useResumeStore } from "@/stores/useResumeStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useIsMobile } from "@/hooks/use-mobile";
import { SaveProvider } from "@/contexts/SaveContext";
import type { Resume, Item } from "@/types/resume";

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

    const sections = (resumeData.sections ?? []).map((section) => {
      const mapped = section.content.items.map((item) => {
        // Map old deprecated item types to new equivalents
        const oldToNew: Record<string, string> = {
          text: "description",
          bullet: "description",
          number: "description",
          date: "description",
          social: "link",
        };
        const newType = oldToNew[item.type] || item.type;

        if (item.type === "date-range" && "value" in item && item.value && typeof item.value === "object") {
          const v = item.value as Record<string, unknown>;
          return {
            ...item,
            type: "date-range" as const,
            value: {
              startDate: v.startDate === "Present" ? "" : (v.startDate as string),
              endDate: v.endDate === "Present" ? undefined : (v.endDate as string | undefined),
            },
          } as Item;
        }
        return { ...item, type: newType } as Item;
      });

      // Merge old single-value 'tag' items into a single 'tags' item
      const results: typeof mapped = [];
      let pendingTags: string[] = [];
      for (const item of mapped) {
        if ((item as { type: string }).type === "tag") {
          if ("value" in item && typeof item.value === "string") {
            pendingTags.push(item.value);
          }
        } else {
          if (pendingTags.length > 0) {
            results.push({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
              visible: true,
              type: "tags" as const,
              value: { items: pendingTags, display: "pill" as const },
            } as Item);
            pendingTags = [];
          }
          results.push(item);
        }
      }
      if (pendingTags.length > 0) {
        results.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
          visible: true,
          type: "tags" as const,
          value: { items: pendingTags, display: "pill" as const },
        } as Item);
        pendingTags = [];
      }

      return {
        ...section,
        content: { ...section.content, items: results },
      };
    });

    const metadata = (resumeData.metadata ?? {}) as Resume["metadata"];
    const templateName = metadata.template || "modern";

    setResume({
      id: initialData.id,
      userId: "",
      title: initialData.title,
      isPublic: initialData.is_public,
      metadata: {
        template: templateName,
        templateConfig: metadata.templateConfig,
        typography: metadata.typography ?? { fontFamily: "inter", fontSize: "md" },
        colors: metadata.colors ?? { background: "#ffffff", text: "#1f2937", accents: [] },
      },
      personal: resumeData.personal ?? { fullName: "", details: [] },
      sections: sections as Resume["sections"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [initialData, setResume]);

  // Enable auto-save and get manual save function
  const { saveNow } = useAutoSave(resumeId);
  const isMobile = useIsMobile();

  return (
    <SaveProvider saveNow={saveNow}>
      <SidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden">
          <EditorSidebar />

          <SidebarInset className="flex-1 overflow-hidden">
            {isMobile ? (
              <FormEditor 
                resumeId={resumeId}
                initialIsPublic={initialData.is_public}
                initialSlug={initialData.slug}
              />
            ) : (
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
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SaveProvider>
  );
}
