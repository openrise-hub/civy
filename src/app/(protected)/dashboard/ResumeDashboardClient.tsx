"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, LayoutGrid, List as ListIcon, FolderClosed, Folder as FolderIcon, MoreVertical, Pencil, Trash2, CheckSquare, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ResumeGrid } from "./ResumeGrid";
import { ResumeList } from "./ResumeList";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { EditFolderDialog } from "./EditFolderDialog";
import { DeleteFolderDialog } from "./DeleteFolderDialog";
import { SelectionActionBar } from "./SelectionActionBar";
import type { ResumeListItem } from "@/lib/resumes/actions";
import type { Folder } from "@/lib/folders/actions";

type SortOption = "updated_desc" | "updated_asc" | "title_asc" | "title_desc";

type ResumeDashboardClientProps = {
  resumes: ResumeListItem[];
  viewCounts: Record<string, number>;
  folders: Folder[];
};

export function ResumeDashboardClient({
  resumes,
  viewCounts,
  folders,
}: ResumeDashboardClientProps) {
  const t = useTranslations("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated_desc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  // Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());

  // Clear selection on folder change
  const [prevFolder, setPrevFolder] = useState<string>(selectedFolder);
  if (selectedFolder !== prevFolder) {
    setPrevFolder(selectedFolder);
    setIsSelectionMode(false);
    setSelectedResumes(new Set());
  }

  const sortOptionsMap: Record<SortOption, string> = {
    updated_desc: t("sortLastEdited"),
    updated_asc: t("sortOldest"),
    title_asc: t("sortTitleAsc"),
    title_desc: t("sortTitleDesc"),
  };

  const filteredAndSortedResumes = useMemo(() => {
    let result = [...resumes];

    // Folder Filtering
    if (selectedFolder !== "all") {
      result = result.filter((r) => r.folder_id === selectedFolder);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(query));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "updated_desc":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "updated_asc":
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [resumes, searchQuery, sortBy, selectedFolder]);

  // Aggregate folder counts for the sidebar
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: resumes.length };
    resumes.forEach(r => {
      if (r.folder_id) {
        counts[r.folder_id] = (counts[r.folder_id] || 0) + 1;
      }
    });
    return counts;
  }, [resumes]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar: Folders */}
      <aside className="w-full md:w-56 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm tracking-tight text-muted-foreground uppercase">{t("folders")}</h3>
        </div>
        
        <CreateFolderDialog />

        <nav className="flex flex-col gap-1">
          <Button
            variant={selectedFolder === "all" ? "secondary" : "ghost"}
            className="justify-start px-3"
            onClick={() => setSelectedFolder("all")}
          >
            <FolderClosed className="mr-2 size-4 opacity-70" />
            <span className="flex-1 text-left">{t("allResumes")}</span>
            <span className="text-xs text-muted-foreground">{folderCounts["all"]}</span>
          </Button>
          
          {folders.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            const count = folderCounts[folder.id] || 0;
            return (
              <div key={folder.id} className="group relative flex items-center">
                <Button
                  variant={isSelected ? "secondary" : "ghost"}
                  className={`flex-1 justify-start px-3 pe-8 transition-colors ${isSelected ? "font-medium" : "font-normal text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <FolderIcon className={`mr-2 size-4 transition-colors ${isSelected ? "fill-current" : ""}`} />
                  <span className="flex-1 text-left truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </Button>
                
                <div className="absolute right-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button size="icon-sm" variant="ghost" aria-label="More options">
                          <MoreVertical className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingFolder(folder)}>
                        <Pencil className="mr-2 size-4" /> {t("renameFolder") || "Rename"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingFolder(folder)} variant="destructive">
                        <Trash2 className="mr-2 size-4" /> {t("delete") || "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <EditFolderDialog 
        folder={editingFolder} 
        open={!!editingFolder} 
        onOpenChange={(open) => !open && setEditingFolder(null)} 
      />
      <DeleteFolderDialog 
        folder={deletingFolder} 
        open={!!deletingFolder} 
        onOpenChange={(open) => !open && setDeletingFolder(null)} 
        onSuccess={() => {
          if (selectedFolder === deletingFolder?.id) setSelectedFolder("all");
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/30 p-4 rounded-xl border">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <ToggleGroup value={[view]} onValueChange={(v) => v.length > 0 && setView(v[0] as "grid" | "list")}>
              <ToggleGroupItem value="grid" aria-label={t("gridView")}>
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label={t("listView")}>
                <ListIcon className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* Selection Toggle */}
            <Button
              variant={isSelectionMode ? "secondary" : "outline"}
              size="icon"
              onClick={() => {
                if (isSelectionMode) {
                  setIsSelectionMode(false);
                  setSelectedResumes(new Set());
                } else {
                  setIsSelectionMode(true);
                }
              }}
              aria-label={isSelectionMode ? t("cancelSelection") : t("selectResumes")}
              title={isSelectionMode ? t("cancelSelection") : t("selectResumes")}
            >
              {isSelectionMode ? <X className="size-4" /> : <CheckSquare className="size-4" />}
            </Button>

            <Separator orientation="vertical" className="h-6" />
            <InputGroup className="w-full sm:w-64">
              <InputGroupAddon>
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              {t("sortBy")}
            </span>
            <Select value={sortBy} onValueChange={(val: SortOption | null) => val && setSortBy(val)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue>{sortOptionsMap[sortBy]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_desc">{t("sortLastEdited")}</SelectItem>
                <SelectItem value="updated_asc">{t("sortOldest")}</SelectItem>
                <SelectItem value="title_asc">{t("sortTitleAsc")}</SelectItem>
                <SelectItem value="title_desc">{t("sortTitleDesc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAndSortedResumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              {searchQuery ? (
                <Search className="size-6 text-muted-foreground" />
              ) : (
                <FolderIcon className="size-6 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {searchQuery ? t("noSearchResults") : t("emptyFolder")}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? t("noSearchResultsDesc") : t("emptyFolderDesc")}
            </p>
          </div>
        ) : view === "grid" ? (
          <ResumeGrid 
            resumes={filteredAndSortedResumes} 
            viewCounts={viewCounts} 
            folders={folders} 
            isSelectionMode={isSelectionMode}
            selectedResumes={selectedResumes}
            setSelectedResumes={setSelectedResumes}
          />
        ) : (
          <ResumeList 
            resumes={filteredAndSortedResumes} 
            viewCounts={viewCounts} 
            folders={folders}
            isSelectionMode={isSelectionMode}
            selectedResumes={selectedResumes}
            setSelectedResumes={setSelectedResumes}
          />
        )}
      </div>

      <SelectionActionBar 
        selectedResumes={selectedResumes}
        setSelectedResumes={setSelectedResumes}
        setIsSelectionMode={setIsSelectionMode}
        resumes={filteredAndSortedResumes}
      />
    </div>
  );
}
