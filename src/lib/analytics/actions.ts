"use server";

import { createClient } from "@/lib/supabase/server";

export type EventType =
  | "create"
  | "duplicate"
  | "toggle_visibility"
  | "download"
  | "view"
  | "restore_version";

/**
 * Track a resume event. Fire-and-forget — errors are logged, not thrown.
 */
export async function trackEvent(
  eventType: EventType,
  resumeId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("resume_events").insert({
      event_type: eventType,
      resume_id: resumeId,
      user_id: user.id,
      metadata: metadata ?? {},
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

/**
 * Track a public view (unauthenticated). No user_id required.
 */
export async function trackPublicView(
  resumeId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("resume_events").insert({
      event_type: "view",
      resume_id: resumeId,
      metadata: metadata ?? {},
    });
  } catch (error) {
    console.error("Failed to track public view:", error);
  }
}

/**
 * Get aggregated stats for a single resume.
 */
export async function getResumeStats(
  resumeId: string
): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("resume_events")
      .select("event_type")
      .eq("resume_id", resumeId);

    if (error || !data) return {};

    const stats: Record<string, number> = {};
    for (const row of data) {
      stats[row.event_type] = (stats[row.event_type] || 0) + 1;
    }

    return stats;
  } catch (error) {
    console.error("Failed to get resume stats:", error);
    return {};
  }
}

/**
 * Get view counts for all of a user's resumes (for dashboard display).
 */
export async function getAllResumeViewCounts(): Promise<
  Record<string, number>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return {};

    const { data, error } = await supabase
      .from("resume_events")
      .select("resume_id")
      .eq("user_id", user.id)
      .eq("event_type", "view");

    if (error || !data) return {};

    const counts: Record<string, number> = {};
    for (const row of data) {
      if (row.resume_id) {
        counts[row.resume_id] = (counts[row.resume_id] || 0) + 1;
      }
    }

    return counts;
  } catch (error) {
    console.error("Failed to get view counts:", error);
    return {};
  }
}

export type ResumeAnalytics = {
  resumeId: string;
  views: number;
  downloads: number;
};

export type AnalyticsSummary = {
  totalViews: number;
  totalDownloads: number;
  resumes: ResumeAnalytics[];
};

/**
 * Get full analytics summary for the dashboard (Pro feature).
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { totalViews: 0, totalDownloads: 0, resumes: [] };

    const { data, error } = await supabase
      .from("resume_events")
      .select("resume_id, event_type")
      .eq("user_id", user.id)
      .in("event_type", ["view", "download"]);

    if (error || !data) return { totalViews: 0, totalDownloads: 0, resumes: [] };

    const map = new Map<string, { views: number; downloads: number }>();
    let totalViews = 0;
    let totalDownloads = 0;

    for (const row of data) {
      if (!row.resume_id) continue;
      const entry = map.get(row.resume_id) ?? { views: 0, downloads: 0 };

      if (row.event_type === "view") {
        entry.views++;
        totalViews++;
      } else if (row.event_type === "download") {
        entry.downloads++;
        totalDownloads++;
      }

      map.set(row.resume_id, entry);
    }

    const resumes: ResumeAnalytics[] = Array.from(map.entries()).map(
      ([resumeId, stats]) => ({ resumeId, ...stats })
    );

    // Sort by views desc
    resumes.sort((a, b) => b.views - a.views);

    return { totalViews, totalDownloads, resumes };
  } catch (error) {
    console.error("Failed to get analytics summary:", error);
    return { totalViews: 0, totalDownloads: 0, resumes: [] };
  }
}
