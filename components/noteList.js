
import { getAllNotes } from "@/lib/notes";
import NoteListClient from "./noteListClient";

export default async function NoteLists() {
  const allNotes = await getAllNotes();

  return <NoteListClient notes={allNotes} />;
}
