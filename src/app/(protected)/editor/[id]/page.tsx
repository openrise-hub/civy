import { notFound } from "next/navigation";
import { getResume } from "@/lib/resumes/actions";
import { EditorClient } from "./EditorClient";

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
