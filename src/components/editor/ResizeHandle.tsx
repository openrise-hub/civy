"use client";

import { Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  className?: string;
  id?: string;
}

export function ResizeHandle({ className, id }: ResizeHandleProps) {
  return (
    <Separator
      id={id}
      className={cn(
        "w-2 bg-border cursor-col-resize transition-colors",
        "hover:bg-primary/30",
        "data-[state=dragging]:bg-primary/50",
        className
      )}
    />
  );
}
