


import NewNoteForm from "@/components/newNoteForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function NewNotes(){

   const user = await getCurrentUser();

  if (!user) {
    redirect("/auth?mode=login");
  }

   return (
      <NewNoteForm/>
   )
}