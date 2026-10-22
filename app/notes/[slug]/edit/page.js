
import FormEdit from "@/components/formEdit";
import UpdateForm from "@/components/updateForm";
import { getCurrentUser } from "@/lib/auth";
import { getNoteBySlug } from "@/lib/notes";
import { redirect } from "next/dist/server/api-utils";



export default async function EditPage({ params }) {

   const user = await getCurrentUser();

  if (!user) {
    redirect("/auth?mode=login");
  }

  const { slug } = await params;
  const noteInfo = await getNoteBySlug(slug);

   return <UpdateForm noteInfo={noteInfo}/>
}
