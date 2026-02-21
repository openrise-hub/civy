"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ResumeGrid } from "./ResumeGrid";
import type { ResumeListItem } from "@/lib/resumes/actions";

type SortOption = "updated_desc" | "updated_asc" | "title_asc" | "title_desc";

type ResumeDashboardClientProps = {
  resumes: ResumeListItem[];
  viewCounts: Record<string, number>;
};

export function ResumeDashboardClient({
  resumes,
  viewCounts,
}: ResumeDashboardClientProps) {
  const t = useTranslations("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated_desc");

  const sortOptionsMap: Record<SortOption, string> = {
    updated_desc: t("sortLastEdited"),
    updated_asc: t("sortOldest"),
    title_asc: t("sortTitleAsc"),
    title_desc: t("sortTitleDesc"),
  };

  const filteredAndSortedResumes = useMemo(() => {
    let result = [...resumes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(query));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "updated_desc":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "updated_asc":
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [resumes, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/30 p-4 rounded-xl border">
        <InputGroup className="w-full sm:max-w-xs">
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

      {filteredAndSortedResumes.length === 0 && resumes.length > 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Search className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{t("noSearchResults")}</h3>
          <p className="text-muted-foreground">{t("noSearchResultsDesc")}</p>
        </div>
      ) : (
        <ResumeGrid resumes={filteredAndSortedResumes} viewCounts={viewCounts} />
      )}
    </div>
  );
}
