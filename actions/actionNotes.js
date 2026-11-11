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

  const result = await createNote(note, user.userId);

if (!result.success) {
  return {
    errors: [result.message],
  };
}

  revalidatePath("/", "layout");
  redirect("/notes");
}

export async function editNoteAction(slug, prevState, formData) {
  const errors = [];

  const user = await getCurrentUser();

  if (!user) {
    return {
      errors: ["Please login first."],
    };
  }

  const oldValue = await getNoteBySlug(slug);

  if (!oldValue) {
    return {
      errors: ["Note not found."],
    };
  }

  // Check ownership before uploading a new image
  if (oldValue.owner !== user.userId) {
    return {
      errors: ["You are not authorized to edit this note."],
    };
  }

  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageURL = oldValue.image;

  if (image && image.size > 0) {
    try {
      imageURL = await uploadImage(image);
    } catch (error) {
      console.error(error);

      return {
        errors: ["Image upload failed. Please try again."],
      };
    }
  }

  const note = {
    title,
    content,
    image: imageURL,
  };

  const result = await updateNote(
    slug,
    user.userId,
    note
  );

  if (!result.success) {
    return {
      errors: [result.message],
    };
  }

  revalidatePath("/", "layout");

  redirect("/notes");
}


export async function deleteNoteAction(slug) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please login first.");
  }

  const result = await deleteNote(
    slug,
    user.userId
  );

  if (!result.success) {
    throw new Error(result.message);
  }

  revalidatePath("/notes");

  return {
    success: true,
  };
}