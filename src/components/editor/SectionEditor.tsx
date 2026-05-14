"use client";

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
import { RESUME_LIMITS } from "@/constants/limits";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrashIcon, TypeIcon, CalendarIcon, EyeIcon, EyeOffIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleStartDateChange = (startDate: string) => {
    onUpdate({ value: { ...item.value, startDate } });
  };

  const handleEndDateChange = (endDate: string) => {
    onUpdate({ value: { ...item.value, endDate } });
  };

  const handlePresentToggle = (isPresent: boolean) => {
    onUpdate({ value: { ...item.value, endDate: isPresent ? undefined : '' } });
  };

  return (
    <div className={cn(
      "space-y-3 p-3 rounded-lg border bg-card item-container transition-opacity",
      item.visible === false && "opacity-50"
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
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Start</Label>
          <DateInput
            value={item.value.startDate}
            onChange={handleStartDateChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">End</Label>
          <div className="flex gap-2">
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                item.value.endDate !== undefined
                  ? "flex-1 opacity-100"
                  : "max-w-0 opacity-0"
              )}
            >
              <DateInput
                value={item.value.endDate || ''}
                onChange={handleEndDateChange}
              />
            </div>
            <Button
              type="button"
              variant={item.value.endDate === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresentToggle(item.value.endDate !== undefined)}
              className="whitespace-nowrap shrink-0"
            >
              Present
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseDateParts(value);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 76 }, (_, i) => currentYear - i);

  const months = [
    { value: "", label: "—" },
    { value: "01", label: "Jan" }, { value: "02", label: "Feb" },
    { value: "03", label: "Mar" }, { value: "04", label: "Apr" },
    { value: "05", label: "May" }, { value: "06", label: "Jun" },
    { value: "07", label: "Jul" }, { value: "08", label: "Aug" },
    { value: "09", label: "Sep" }, { value: "10", label: "Oct" },
    { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
  ];

  const emit = (y: string, m: string, d: string) => {
    if (!y) { onChange(""); return; }
    let v = y;
    if (m) v += `-${m}`;
    if (m && d) v += `-${d}`;
    onChange(v);
  };

  return (
    <div className="flex gap-1">
      <Select value={parsed.year} onValueChange={(y) => emit(y ?? "", parsed.month, parsed.day)}>
        <SelectTrigger className="h-8 text-xs w-[72px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">—</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={parsed.month} onValueChange={(m) => emit(parsed.year, m ?? "", m ? parsed.day : "")}>
        <SelectTrigger className="h-8 text-xs w-[56px]">
          <SelectValue placeholder="Mon" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {parsed.month && (
        <Input
          type="number"
          min={1}
          max={31}
          placeholder="DD"
          value={parsed.day}
          onChange={(e) => {
            const d = e.target.value.padStart(2, "0");
            emit(parsed.year, parsed.month, d);
          }}
          className="h-8 w-[44px] text-xs px-1"
        />
      )}
    </div>
  );
}

function parseDateParts(value: string): { year: string; month: string; day: string } {
  if (!value) return { year: "", month: "", day: "" };
  const m = value.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (m) return { year: m[1], month: m[2] || "", day: m[3] || "" };
  return { year: value, month: "", day: "" };
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