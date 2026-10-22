"use client";

import { deleteNoteAction } from "@/actions/actionNotes";
import { useOptimistic, useState, useTransition } from "react";
import NoteCard from "./notecard";

export default  function NoteListClient({ notes }) {
  const [optimisticNotes, addOptimitic] = useOptimistic(
    notes,
    (currNotes, slug) => currNotes.filter((note) => note.slug !== slug),
  );

  const [isPending,startTransition] = useTransition();

  const [error,setError] = useState("");

  function handleDelete(slug){
    setError("");
    startTransition(
        async()=>{
            addOptimitic(slug);

            try{
                await deleteNoteAction(slug);
            }catch(error){
                  setError("Note delete nahi ho paya. Dobara try karo.");
            }
        }
    )
  }
  return (
    <>
    {error && <p role="alert">{error}</p>}

    <ul className="posts">
        {optimisticNotes.map((note) => (
          <li key={note._id.toString()}>
            <NoteCard
              {...note}
              onDelete={handleDelete}
              isPending={isPending}
            />
          </li>
        ))}
      </ul>
    </>
  )

}
