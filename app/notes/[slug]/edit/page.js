import UpdateForm from "@/components/updateForm";

import { getCurrentUser } from "@/lib/auth";
import { getNoteBySlug } from "@/lib/notes";

import { redirect, notFound } from "next/navigation";

export default async function EditPage({ params }) {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth?mode=login");
  }

  const { slug } = await params;

  const noteInfo = await getNoteBySlug(slug);

  if (!noteInfo) {
    notFound();
  }

  // Ownership check
  if (noteInfo.owner !== user.userId) {
    redirect("/notes");
  }

  return (
    <UpdateForm noteInfo={noteInfo} />
  );
}