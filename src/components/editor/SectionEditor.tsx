"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/useResumeStore";
import { ItemType, Item, Section } from "@/types/resume";
import { 
  isStringItem, 
  isDateRangeItem, 
  isLinkItem, 
  isRatingItem, 
  isImageItem, 
  isSeparatorItem 
} from "@/lib/resume-helpers";
import { parseDateValue, validateDateRange } from "@/lib/resume-helpers";
import { RESUME_LIMITS } from "@/constants/limits";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverPopup } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TrashIcon, TypeIcon, CalendarIcon, EyeIcon, EyeOffIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { useTranslations } from "next-intl";

interface SectionEditorProps {
  section: Section;
}

interface ItemEditorProps {
  item: Item;
  t: (key: string) => string;
  onUpdate: (data: Partial<Item>) => void;
  onRemove: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onToggleVisibility: (e: React.MouseEvent) => void;
}

function ItemEditor({ item, t, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (isStringItem(item)) {
    return <StringItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  if (isDateRangeItem(item)) {
    return <DateRangeItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  if (isLinkItem(item)) {
    return <LinkItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  if (isRatingItem(item)) {
    return <RatingItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  if (isImageItem(item)) {
    return <ImageItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  if (isSeparatorItem(item)) {
    return <SeparatorItemEditor item={item} t={t} onUpdate={onUpdate} onRemove={onRemove} onDuplicate={onDuplicate} onToggleVisibility={onToggleVisibility} />;
  }
  return null;
}

function ItemActions({ 
  visible, 
  onRemove, 
  onDuplicate, 
  onToggleVisibility,
  className 
}: { 
  visible?: boolean; 
  onRemove: (e: React.MouseEvent) => void; 
  onDuplicate: (e: React.MouseEvent) => void; 
  onToggleVisibility: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleVisibility}
        className="text-muted-foreground hover:text-primary"
        title={visible === false ? "Show on PDF" : "Hide from PDF"}
      >
        {visible === false ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDuplicate}
        className="text-muted-foreground hover:text-primary"
        title="Duplicate"
      >
        <CopyIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
        title="Remove"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}

function StringItemEditor({ item, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (!isStringItem(item)) return null;

  const isDescription = item.type === 'description';
  const isLarge = item.type === 'heading' || item.type === 'sub-heading';
  const charCount = item.value.length;
  const maxChars = RESUME_LIMITS.MAX_TEXT_FIELD;
  const isNearLimit = charCount >= maxChars * 0.9;

  return (
    <div className={cn(
      "flex items-start gap-2 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
    )}>
      <div className="flex-1 space-y-1">
        {isDescription ? (
          <Textarea
            value={item.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Write your content here.&#10;&#10;- Start a line with a dash for bullet points&#10;1. Start with a number for ordered lists&#10;[Click here](https://example.com) to add a link&#10;&#10;Leave a blank line between paragraphs."
            maxLength={maxChars}
            className="resize-y min-h-[120px] font-mono text-sm"
          />
        ) : (
          <Input
            value={item.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder={`Enter ${item.type}...`}
            maxLength={maxChars}
            size={isLarge ? "default" : "sm"}
          />
        )}
        <div className={cn(
          "text-xs text-right",
          isNearLimit ? "text-amber-500" : "text-muted-foreground"
        )}>
          {charCount.toLocaleString()} / {maxChars.toLocaleString()}
        </div>
      </div>
      <ItemActions 
        visible={item.visible} 
        onRemove={onRemove} 
        onDuplicate={onDuplicate} 
        onToggleVisibility={onToggleVisibility} 
        className="flex-shrink-0"
      />
    </div>
  );
}

function DateRangeItemEditor({ item, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (!isDateRangeItem(item)) return null;

  const error = validateDateRange(item.value.startDate, item.value.endDate);

  return (
    <div className={cn(
      "space-y-3 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50",
      error && "border-destructive"
    )}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Date Range</Label>
        <ItemActions 
          visible={item.visible} 
          onRemove={onRemove} 
          onDuplicate={onDuplicate} 
          onToggleVisibility={onToggleVisibility} 
        />
      </div>
      
      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Start</Label>
          <DatePickerPopover
            value={item.value.startDate}
            onChange={(v) => onUpdate({ value: { ...item.value, startDate: v } })}
            error={!!error}
          />
        </div>

        {item.value.endDate !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End</Label>
              <DatePickerPopover
                value={item.value.endDate || ''}
                onChange={(v) => onUpdate({ value: { ...item.value, endDate: v } })}
                error={!!error}
              />
          </div>
        )}

        <Button
          type="button"
          variant={item.value.endDate === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => onUpdate({ value: { ...item.value, endDate: item.value.endDate === undefined ? '' : undefined } })}
          className="mb-0.5 shrink-0"
        >
          Present
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function DatePickerPopover({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const parsed = parseDateValue(value);
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [y, setY] = useState(currentYear);
  const [m, setM] = useState(-1);
  const [d, setD] = useState(0);
  const monthSelected = m >= 0;
  const daySelected = d > 0;

  const [decadeStart, setDecadeStart] = useState(() =>
    Math.floor(currentYear / 10) * 10
  );

  const emit = (year: number, month: number | null, day: number | null) => {
    if (month === null) onChange(`${year}`);
    else if (day === null) onChange(`${year}-${String(month + 1).padStart(2, "0")}`);
    else onChange(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  // Only show a selected day if the value has day-level precision
  const hasDay = /^\d{4}-\d{2}-\d{2}$/.test(value || "");
  const calendarSelected = hasDay && parsed ? parsed : undefined;

  const displayLabel = (() => {
    if (!value) return "Pick a date";
    const dt = parseDateValue(value);
    if (!dt) return value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return format(dt, "MMM d, yyyy");
    if (/^\d{4}-\d{2}$/.test(value)) return format(dt, "MMM yyyy");
    return format(dt, "yyyy");
  })();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // Closing popover: emit whatever precision was actually selected
          if (step >= 3 && daySelected) emit(y, m, d);
          else if (step >= 2 && monthSelected) emit(y, m, null);
          else emit(y, null, null);
        } else {
          const p = parseDateValue(value);
          if (p) {
            setY(p.getFullYear());
            const hasMonth = /^\d{4}-\d{2}/.test(value || "");
            const hasDay = /^\d{4}-\d{2}-\d{2}$/.test(value || "");
            setM(hasMonth ? p.getMonth() : -1);
            setD(hasDay ? p.getDate() : 0);
            setStep(hasDay ? 3 : hasMonth ? 2 : 1);
          } else {
            setM(-1);
            setD(0);
            setStep(1);
          }
        }
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger
        render={
          <button className={cn(
            "flex h-8 items-center gap-1 rounded-md border px-2 text-xs min-w-[120px]",
            error ? "border-destructive" : "border-input",
            !value && "text-muted-foreground"
          )}>
            <CalendarIcon className="size-3 shrink-0" />
            <span className="truncate">{displayLabel}</span>
          </button>
        }
      />
      <PopoverPopup align="start" side="bottom" sideOffset={4} className="w-fit p-0">
        {/* Breadcrumb */}
        {step > 1 && (
          <div className="flex items-center gap-0.5 border-b px-2 py-1.5 text-xs">
            <button
              onClick={() => { setStep(1); emit(y, null, null); }}
              className="rounded px-1 py-0.5 hover:bg-muted transition-colors"
            >
              {y}
            </button>
            {step >= 3 && (
              <>
                <span className="text-muted-foreground">›</span>
                <button
                  onClick={() => { setStep(2); emit(y, m, null); }}
                  className="rounded px-1 py-0.5 hover:bg-muted transition-colors"
                >
                  {months[m]}
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-1.5">
          {/* Step 1: Year grid with decade pagination */}
          {step === 1 && (
            <div className="mx-auto">
              <div className="flex items-center justify-between mb-1 px-1">
                <button
                  onClick={() => setDecadeStart((s) => s - 10)}
                  className="rounded p-0.5 hover:bg-muted transition-colors"
                >
                  <ChevronLeftIcon className="size-3" />
                </button>
                <span className="text-xs font-medium text-muted-foreground">
                  {decadeStart}–{decadeStart + 9}
                </span>
                <button
                  onClick={() => setDecadeStart((s) => Math.min(s + 10, currentYear))}
                  disabled={decadeStart + 10 > currentYear}
                  className="rounded p-0.5 hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronRightIcon className="size-3" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 10 }, (_, i) => decadeStart + i)
                  .filter((year) => year <= currentYear)
                  .map((year) => (
                  <button
                    key={year}
                    onClick={() => { setY(year); setStep(2); } }
                    className={cn(
                      "rounded px-1.5 py-1 text-xs hover:bg-muted transition-colors",
                      parseInt(value) === year && "bg-primary text-primary-foreground"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Month grid */}
          {step === 2 && (
            <div className="grid grid-cols-3 gap-1.5 mx-auto">
              {months.map((mon, i) => (
                <button
                  key={mon}
                  onClick={() => { setM(i); setStep(3); } }
                  className={cn(
                    "rounded px-3 py-1.5 text-xs hover:bg-muted transition-colors",
                    /^\d{4}-\d{2}$/.test(value) && parsed && parsed.getMonth() === i && parsed.getFullYear() === y && "bg-primary text-primary-foreground"
                  )}
                >
                  {mon}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Day calendar */}
          {step === 3 && (
            <Calendar
              mode="single"
              selected={calendarSelected}
              defaultMonth={new Date(y, m, 1)}
              onSelect={(date) => {
                if (date) {
                  setD(date.getDate());
                  emit(date.getFullYear(), date.getMonth(), date.getDate());
                  setOpen(false);
                }
              }}
              captionLayout="dropdown"
              className="rounded-md"
            />
          )}
        </div>
      </PopoverPopup>
    </Popover>
  );
}

function LinkItemEditor({ item, t, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (!isLinkItem(item)) return null;

  const handleLabelChange = (label: string) => {
    onUpdate({ value: { ...item.value, label } });
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ value: { ...item.value, url } });
  };

  return (
    <div className={cn(
      "space-y-3 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
    )}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Link</Label>
        <ItemActions 
          visible={item.visible} 
          onRemove={onRemove} 
          onDuplicate={onDuplicate} 
          onToggleVisibility={onToggleVisibility} 
        />
      </div>
      
      <div className="space-y-2">
        <Input
          value={item.value.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder={t("placeholders.linkLabel")}
          size="sm"
        />
        <Input
          value={item.value.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={t("placeholders.linkUrl")}
          size="sm"
        />
      </div>
    </div>
  );
}

function RatingItemEditor({ item, t, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (!isRatingItem(item)) return null;

  const handleLabelChange = (label: string) => {
    onUpdate({ value: { ...item.value, label } });
  };

  const handleScoreChange = (score: number) => {
    onUpdate({ value: { ...item.value, score } });
  };

  const handleMaxChange = (max: number) => {
    onUpdate({ value: { ...item.value, max } });
  };

  const handleDisplayChange = (display: 'stars' | 'bar' | 'dots') => {
    onUpdate({ value: { ...item.value, display } });
  };

  return (
    <div className={cn(
      "space-y-3 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
    )}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Skill Rating</Label>
        <ItemActions 
          visible={item.visible} 
          onRemove={onRemove} 
          onDuplicate={onDuplicate} 
          onToggleVisibility={onToggleVisibility} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Skill</Label>
          <Input
            value={item.value.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder={t("placeholders.skillLabel")}
            size="sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Display</Label>
          <Select
            value={item.value.display}
            onValueChange={(value) => {
              if (value) handleDisplayChange(value as 'stars' | 'bar' | 'dots');
            }}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="bar">Progress Bar</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Score</Label>
          <Input
            type="number"
            min="0"
            max={item.value.max}
            value={item.value.score}
            onChange={(e) => handleScoreChange(parseInt(e.target.value) || 0)}
            size="sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <Input
            type="number"
            min="1"
            value={item.value.max}
            onChange={(e) => handleMaxChange(parseInt(e.target.value) || 5)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

function ImageItemEditor({ item, t, onUpdate, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  if (!isImageItem(item)) return null;

  const handleUrlChange = (url: string) => {
    onUpdate({ value: { ...item.value, url } });
  };

  const handleAltChange = (alt: string) => {
    onUpdate({ value: { ...item.value, alt } });
  };

  const handleShapeChange = (shape: 'circle' | 'square') => {
    onUpdate({ value: { ...item.value, shape } });
  };

  return (
    <div className={cn(
      "space-y-3 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
    )}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Image</Label>
        <ItemActions 
          visible={item.visible} 
          onRemove={onRemove} 
          onDuplicate={onDuplicate} 
          onToggleVisibility={onToggleVisibility} 
        />
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Image URL</Label>
          <Input
            value={item.value.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={t("placeholders.linkUrl")}
            size="sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Alt Text</Label>
            <Input
              value={item.value.alt || ''}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="Description"
              size="sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Shape</Label>
<Select
            value={item.value.shape || 'square'}
            onValueChange={(value) => {
              if (value) handleShapeChange(value as 'circle' | 'square');
            }}
          >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeparatorItemEditor({ item, onRemove, onDuplicate, onToggleVisibility }: ItemEditorProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
    )}>
      <div className="flex-1">
        <div className="h-px bg-border w-full"></div>
      </div>
      <ItemActions 
        visible={item.visible} 
        onRemove={onRemove} 
        onDuplicate={onDuplicate} 
        onToggleVisibility={onToggleVisibility} 
        className="ml-3"
      />
    </div>
  );
}

function AddItemToolbar({ onAdd, disabled }: { onAdd: (type: ItemType) => void; disabled?: boolean }) {
  if (disabled) {
    return (
      <div className="p-3 rounded-lg border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
        Maximum {RESUME_LIMITS.MAX_ITEMS_PER_SECTION} items reached
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 p-2 rounded-lg border border-dashed bg-muted/30 add-item-toolbar">
      <button
        onClick={() => onAdd("heading")}
        title="Heading"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <TypeIcon className="size-3.5" />
        Heading
      </button>
      <button
        onClick={() => onAdd("sub-heading")}
        title="Subtitle"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <TypeIcon className="size-3.5" />
        Subtitle
      </button>
      <button
        onClick={() => onAdd("description")}
        title="Description"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <TypeIcon className="size-3.5" />
        Text
      </button>
      <button
        onClick={() => onAdd("date-range")}
        title="Date Range"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <CalendarIcon className="size-3.5" />
        Dates
      </button>
    </div>
  );
}

export function SectionEditor({ section }: SectionEditorProps) {
  const tEditor = useTranslations("editor");
  const addItem = useResumeStore((state) => state.addItem);
  const updateItem = useResumeStore((state) => state.updateItem);
  const removeItem = useResumeStore((state) => state.removeItem);

  const itemCount = section.content.items.length;
  const canAdd = itemCount < RESUME_LIMITS.MAX_ITEMS_PER_SECTION;

  const handleAddItem = (type: ItemType) => {
    addItem(section.id, type);
  };

  const handleUpdateItem = (itemId: string, data: Partial<Item>) => {
    updateItem(section.id, itemId, data);
  };

  const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const container = target.closest('.item-container');
    
    if (container) {
      const nextFocus = container.nextElementSibling || container.previousElementSibling;
      
      if (nextFocus && nextFocus.classList.contains('item-container')) {
        const focusable = nextFocus.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusable) {
          setTimeout(() => focusable.focus(), 0);
        }
      } else {
        // Fallback to toolbar
        const toolbar = container.parentElement?.querySelector('.add-item-toolbar') as HTMLElement;
        if (toolbar) {
          const focusable = toolbar.querySelector('button') as HTMLElement;
          if (focusable) setTimeout(() => focusable.focus(), 0);
        }
      }
    }

    removeItem(section.id, itemId);
  };

  return (
    <div
      className="space-y-3 p-3"
      onFocusCapture={() => useResumeStore.getState().setActiveSectionId(section.id)}
    >
      {section.content.items.map((item) => (
        <ItemEditor
          key={item.id}
          item={item}
          t={tEditor}
          onUpdate={(data) => handleUpdateItem(item.id, data)}
          onRemove={(e) => handleRemoveItem(item.id, e)}
          onDuplicate={() => useResumeStore.getState().duplicateItem(section.id, item.id)}
          onToggleVisibility={() => handleUpdateItem(item.id, { visible: !item.visible })}
        />
      ))}
      
      <AddItemToolbar onAdd={handleAddItem} disabled={!canAdd} />
    </div>
  );
}