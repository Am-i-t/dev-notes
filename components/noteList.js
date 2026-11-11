import { getAllNotes } from "@/lib/notes";
import { getCurrentUser } from "@/lib/auth";

import NoteListClient from "./noteListClient";

export default async function NoteLists() {
  const allNotes = await getAllNotes();

  const user = await getCurrentUser();

  return (
    <NoteListClient
      notes={allNotes}
      currentUserId={user?.userId ?? null}
    />
  );
}