"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { FormEditor } from "@/components/editor/FormEditor";
import { PreviewPanel } from "@/components/editor/PreviewPanel";

export default function EditorPage() {
  return (
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
  );
}
