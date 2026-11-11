import { redirect } from "next/navigation";
import NoteLists from "@/components/noteList";
import { getPaginatedNotes } from "@/lib/notes";

export default async function NotesPage({ searchParams }) {

  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ) {
    redirect("/notes?page=1");
  }

  const data = await getPaginatedNotes(currentPage, 3);

  if (currentPage > data.totalPages && data.totalPages > 0) {
    redirect(`/notes?page=${data.totalPages}`);
  }

  return <NoteLists page={currentPage} />;
}