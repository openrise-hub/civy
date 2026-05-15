import { notFound } from "next/navigation";
import { getResume } from "@/lib/resumes/actions";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const EditorClient = dynamic(
  () => import("./EditorClient").then((mod) => ({ default: mod.EditorClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-dvh bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;

  const resume = await getResume(id);

  if (!resume) {
    notFound();
  }

  return <EditorClient resumeId={id} initialData={resume} />;
}
