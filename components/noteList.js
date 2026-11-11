import { getPaginatedNotes } from "@/lib/notes";
import { getCurrentUser } from "@/lib/auth";

import NoteListClient from "./noteListClient";

export default async function NoteLists({ page }) {

  const user = await getCurrentUser();

  const data = await getPaginatedNotes(page, 3);

  return (
    <NoteListClient
      notes={data.notes}
      currentUserId={user?.userId ?? null}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      totalNotes={data.totalNotes}
    />
  );
}