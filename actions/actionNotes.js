"use server";
import { uploadImage } from "@/lib/cloudinary";
import { createNote, deleteNote, getNoteBySlug, updateNote } from "@/lib/notes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { getCurrentUser } from "@/lib/auth";

export async function createNoteAction(prevState, formData) {
  
  let errors = [];
  const user = await getCurrentUser();

  if (!user) {
    return { errors: ["Please login first."] };
  }

  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");


  if (!title || title.trim().length === 0) {
    errors.push("Title is required...");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required...");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required...");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const slug = slugify(title, { lower: true });

  if (!slug || slug.trim().length === 0) {
    errors.push("Unable to generate a valid slug");
  } else {
    const isPresent = await getNoteBySlug(slug);

    if (isPresent) {
      errors.push("A note with this title already exists");
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageURL;

  try {
    imageURL = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed, note was not created.Please try again later",
    );
  }

  let note = {
    title,
    slug,
    content,
    image: imageURL,
  };

  await createNote(note);

  revalidatePath("/", "layout");
  redirect("/notes");
}

export async function editNoteAction(slug, prevState, formData) {
  let errors = [];
  
  const user = await getCurrentUser();

  if (!user) {
    return { errors: ["Please login first."] };
  }

    const oldValue = await getNoteBySlug(slug);
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");


    if (!title || title.trim().length === 0) {
      errors.push("Title is required...");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Content is required...");
    }

     if (errors.length > 0) {
        return { errors };
      }

    if (!image || image.size === 0) {
     const oldimage = oldValue.image;
       let note = {
      title,
      slug,
      content,
      image:oldimage,
    };

    await updateNote(slug, note);
    } else {
      let imageURL;

      try {
        imageURL = await uploadImage(image);
      } catch (error) {
        throw new Error(
          "Image upload failed, note was not created.Please try again later",
        );
      }

        let note = {
      title,
      slug,
      content,
      image: imageURL,
    };

    await updateNote(slug, note);
    }


    revalidatePath("/", "layout");
    redirect("/notes");
  
}



export async function deleteNoteAction(slug) {

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please login first.");
  }

  const result = await deleteNote(slug);

  if (result?.success === false) {
    throw new Error(result.message);
  }

  if (result?.deletedCount === 0) {
    throw new Error("Note not found.");
  }

  revalidatePath("/notes");

  return { success: true };
}
