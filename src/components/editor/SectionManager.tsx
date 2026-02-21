"use client";

import { useResumeStore } from "@/stores/useResumeStore";
import { Section } from "@/types/resume";
import { RESUME_LIMITS } from "@/constants/limits";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionEditor } from "@/components/editor/SectionEditor";
import { TrashIcon, GripVertical } from "lucide-react";
import { DndContext, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, type DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

function DragHandle({ attributes, listeners }: DragHandleProps) {
  return (
    <div
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
      role="button"
      tabIndex={0}
      aria-label="Drag to reorder section"
    >
      <GripVertical className="size-4" />
    </div>
  );
}

interface SortableSectionCardProps {
  section: Section;
  onUpdateTitle: (sectionId: string, title: string) => void;
  onRemove: (sectionId: string, e: React.MouseEvent) => void;
}

function SortableSectionCard({ section, onUpdateTitle, onRemove }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative section-container", 
        isDragging && "shadow-lg"
      )}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <DragHandle attributes={attributes} listeners={listeners} />
            <Input
              value={section.title}
              onChange={(e) => onUpdateTitle(section.id, e.target.value)}
              className="text-base font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
            />
            <div className="flex-1" />
            <CardAction>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => onRemove(section.id, e)}
                className="text-muted-foreground hover:text-destructive"
              >
                <TrashIcon className="size-4" />
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SectionEditor section={section} />
        </CardContent>
      </Card>
    </div>
  );
}

export function SectionManager() {
  const isMounted = useIsMounted();
  const sections = useResumeStore((state) => state.resume.sections);
  const removeSection = useResumeStore((state) => state.removeSection);
  const updateSection = useResumeStore((state) => state.updateSection);
  const reorderSections = useResumeStore((state) => state.reorderSections);

  const sectionCount = sections.length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      reorderSections(active.id as string, over.id as string);
    }
  };

  const handleTitleChange = (sectionId: string, newTitle: string) => {
    updateSection(sectionId, { title: newTitle });
  };

  const handleRemoveSection = (sectionId: string, e: React.MouseEvent) => {
    // focus restoration logic
    const target = e.currentTarget as HTMLElement;
    const container = target.closest('.section-container');
    
    if (container) {
      const nextFocus = container.nextElementSibling || container.previousElementSibling;
      
      if (nextFocus) {
        // Find a focusable element within the sibling section
        const focusable = nextFocus.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusable) {
          setTimeout(() => focusable.focus(), 0);
        }
      } else {
        // Fallback to the add section button if no sections remain
        const addSectionBtn = document.querySelector('.add-section-btn') as HTMLElement;
        if (addSectionBtn) {
          setTimeout(() => addSectionBtn.focus(), 0);
        }
      }
    }

    removeSection(sectionId);
  };

  // Render static content during SSR to avoid hydration mismatch with dnd-kit
  if (!isMounted) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground px-1">
          <span>Sections: {sectionCount} / {RESUME_LIMITS.MAX_SECTIONS}</span>
        </div>
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground p-1">
                    <GripVertical className="size-4" />
                  </div>
                  <Input
                    value={section.title}
                    readOnly
                    className="text-base font-semibold border-none bg-transparent px-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <SectionEditor section={section} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground px-1">
        <span>Sections: {sectionCount} / {RESUME_LIMITS.MAX_SECTIONS}</span>
      </div>
      <SortableContext
        items={sections.map(section => ({ id: section.id }))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sections.map((section) => (
            <SortableSectionCard
              key={section.id}
              section={section}
              onUpdateTitle={handleTitleChange}
              onRemove={handleRemoveSection}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}