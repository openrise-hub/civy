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
import { TrashIcon, TypeIcon, CalendarIcon, LinkIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  section: Section;
}

interface ItemEditorProps {
  item: Item;
  onUpdate: (data: Partial<Item>) => void;
  onRemove: (e: React.MouseEvent) => void;
}

function ItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
  if (isStringItem(item)) {
    return <StringItemEditor item={item} onUpdate={onUpdate} onRemove={onRemove} />;
  }
  if (isDateRangeItem(item)) {
    return <DateRangeItemEditor item={item} onUpdate={onUpdate} onRemove={onRemove} />;
  }
  if (isLinkItem(item)) {
    return <LinkItemEditor item={item} onUpdate={onUpdate} onRemove={onRemove} />;
  }
  if (isRatingItem(item)) {
    return <RatingItemEditor item={item} onUpdate={onUpdate} onRemove={onRemove} />;
  }
  if (isImageItem(item)) {
    return <ImageItemEditor item={item} onUpdate={onUpdate} onRemove={onRemove} />;
  }
  if (isSeparatorItem(item)) {
    return <SeparatorItemEditor onRemove={onRemove} />;
  }
  return null;
}

function StringItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
  if (!isStringItem(item)) return null;

  const isTextarea = item.type === 'text' || item.type === 'bullet';
  const isLarge = item.type === 'heading' || item.type === 'sub-heading';
  const charCount = item.value.length;
  const maxChars = RESUME_LIMITS.MAX_TEXT_FIELD;
  const isNearLimit = charCount >= maxChars * 0.9;

  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border bg-card item-container">
      <div className="flex-1 space-y-1">
        {isTextarea ? (
          <Textarea
            value={item.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder={`Enter ${item.type}...`}
            maxLength={maxChars}
            className="resize-none"
            rows={item.type === 'bullet' ? 2 : 3}
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
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive flex-shrink-0"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}

function DateRangeItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
  if (!isDateRangeItem(item)) return null;

  const handleStartDateChange = (startDate: string) => {
    onUpdate({ value: { ...item.value, startDate } });
  };

  const handleEndDateChange = (endDate: string) => {
    onUpdate({ value: { ...item.value, endDate: endDate || undefined } });
  };

  const handlePresentToggle = (isPresent: boolean) => {
    onUpdate({ value: { ...item.value, endDate: isPresent ? undefined : '' } });
  };

  return (
    <div className="space-y-3 p-3 rounded-lg border bg-card item-container">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Date Range</Label>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`start-${item.id}`} className="text-xs text-muted-foreground">Start</Label>
          <Input
            id={`start-${item.id}`}
            type="month"
            value={item.value.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            size="sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`end-${item.id}`} className="text-xs text-muted-foreground">End</Label>
          <div className="flex gap-2">
            <Input
              id={`end-${item.id}`}
              type="month"
              value={item.value.endDate || ''}
              onChange={(e) => handleEndDateChange(e.target.value)}
              placeholder="Present"
              size="sm"
              disabled={!item.value.endDate}
            />
            <Button
              type="button"
              variant={!item.value.endDate ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresentToggle(!item.value.endDate)}
              className="whitespace-nowrap"
            >
              Present
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
  if (!isLinkItem(item)) return null;

  const handleLabelChange = (label: string) => {
    onUpdate({ value: { ...item.value, label } });
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ value: { ...item.value, url } });
  };

  return (
    <div className="space-y-3 p-3 rounded-lg border bg-card item-container">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {item.type === 'social' ? 'Social Link' : 'Link'}
        </Label>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Input
          value={item.value.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Link label (e.g., Portfolio, LinkedIn)"
          size="sm"
        />
        <Input
          value={item.value.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
          size="sm"
        />
      </div>
    </div>
  );
}

function RatingItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
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
    <div className="space-y-3 p-3 rounded-lg border bg-card item-container">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Skill Rating</Label>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Skill</Label>
          <Input
            value={item.value.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="e.g., JavaScript"
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

function ImageItemEditor({ item, onUpdate, onRemove }: ItemEditorProps) {
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
    <div className="space-y-3 p-3 rounded-lg border bg-card item-container">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Image</Label>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Image URL</Label>
          <Input
            value={item.value.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://..."
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

function SeparatorItemEditor({ onRemove }: { onRemove: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card item-container">
      <div className="flex-1">
        <div className="h-px bg-border w-full"></div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive ml-3"
      >
        <TrashIcon className="size-4" />
      </Button>
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
    <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-dashed bg-muted/30 add-item-toolbar">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('heading')}
        className="text-xs"
      >
        <TypeIcon className="size-3 mr-1" />
        Heading
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('text')}
        className="text-xs"
      >
        <TypeIcon className="size-3 mr-1" />
        Text
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('bullet')}
        className="text-xs"
      >
        <TypeIcon className="size-3 mr-1" />
        Bullet
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('date-range')}
        className="text-xs"
      >
        <CalendarIcon className="size-3 mr-1" />
        Date Range
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('link')}
        className="text-xs"
      >
        <LinkIcon className="size-3 mr-1" />
        Link
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdd('rating')}
        className="text-xs"
      >
        <StarIcon className="size-3 mr-1" />
        Rating
      </Button>
    </div>
  );
}

export function SectionEditor({ section }: SectionEditorProps) {
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
    <div className="space-y-3 p-3">
      <div className="text-xs text-muted-foreground">
        Items: {itemCount} / {RESUME_LIMITS.MAX_ITEMS_PER_SECTION}
      </div>
      
      {section.content.items.map((item) => (
        <ItemEditor
          key={item.id}
          item={item}
          onUpdate={(data) => handleUpdateItem(item.id, data)}
          onRemove={(e) => handleRemoveItem(item.id, e)}
        />
      ))}
      
      <AddItemToolbar onAdd={handleAddItem} disabled={!canAdd} />
    </div>
  );
}