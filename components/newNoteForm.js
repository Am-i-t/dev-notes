'use client'
import {createNoteAction} from "@/actions/actionNotes";
import FormSubmit from "@/components/formSubmit";
import { useActionState } from "react";

export default function NewNoteForm(){
    const [state,formAction] = useActionState(createNoteAction,{})

    return (
        <>
      <h1 className="form-header">Create a Note</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="15" />
        </p>
        <h3 className="form-actions">
         <FormSubmit/>
        </h3>
        {state.errors && (
            <ul className="form-error">
                {
                    state.errors.map((error)=>(
                        <li key={error}>{error}</li>
                    ))
                }
            </ul>
        )}
      </form>
    </>
    )
}