import { notFound } from "next/navigation";
import { getPublicResume } from "@/lib/resumes/actions";
import { PublicResumeViewer } from "./PublicResumeViewer";
import { trackPublicView, getResumeStats } from "@/lib/analytics/actions";

type PageProps = {
  params: Promise<{ shareSlug: string }>;
};

export default async function PublicResumePage({ params }: PageProps) {
  const { shareSlug } = await params;
  
  const resume = await getPublicResume(shareSlug);

  if (!resume) {
    notFound();
  }

  // Fire-and-forget view tracking
  trackPublicView(resume.id).catch(() => {});

  // Fetch view count for display
  const stats = await getResumeStats(resume.id);
  const viewCount = stats["view"] ?? 0;

  return <PublicResumeViewer resume={resume} viewCount={viewCount} />;
}
