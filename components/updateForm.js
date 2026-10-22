"use client";

import { useActionState, useState } from "react";
import FormEdit from "./formEdit";
import { editNoteAction } from "@/actions/actionNotes";


export default function UpdateForm(props) {

  const editAction = editNoteAction.bind(null,props.noteInfo.slug)

  const [state, formAction] = useActionState(editAction, {});

  const [imagePreview, setImagePreview] = useState(props.noteInfo.image);
  return (
    <>
      <h1 className="form-header">Editing Note!</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={props.noteInfo.title}
          />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
          <span style={{ color: "red", display: "flex" }}>
            Last Selected Image:
          </span>{" "}
          <img src={imagePreview} alt="Note image preview" width="200" />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="15"
            defaultValue={props.noteInfo.content}
          />
        </p>
        <h3 className="form-actions">
          <FormEdit />
        </h3>
        {state.errors && (
          <ul className="form-error">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
