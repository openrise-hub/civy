import { notFound } from "next/navigation";
import { getResume } from "@/lib/resumes/actions";
import { EditorClientWrapper } from "./EditorClientWrapper";

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;

  const resume = await getResume(id);

  if (!resume) {
    notFound();
  }

  return <EditorClientWrapper resumeId={id} initialData={resume} />;
}
