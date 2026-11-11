import dbConnect from "./db";
import NoteModel from "@/models/note";
import xss from "xss";

function isInvalidText(text) {
  return typeof text !== "string" || text.trim() === "";
}

export async function createNote(note, userId) {
  try {
    await dbConnect();

    if (
      isInvalidText(note.title) ||
      isInvalidText(note.slug) ||
      isInvalidText(note.content) ||
      isInvalidText(note.image) ||
      isInvalidText(userId)
    ) {
      return {
        success: false,
        message: "Invalid input.",
      };
    }

    const newNote = new NoteModel({
      title: note.title,
      slug: note.slug,
      image: note.image,
      content: xss(note.content),

      owner: userId,
    });

    await newNote.save();

    return {
      success: true,
      message: "Note created successfully!",
    };

  } catch (error) {
    console.error("Failed to create note:", error);

    return {
      success: false,
      message: "Failed to create note.",
    };
  }
}

export async function getAllNotes() {
  try {
    await dbConnect();

    const notes = await NoteModel.find().lean();

    return notes.map((note) => ({
      ...note,

      _id: note._id.toString(),

      owner: note.owner.toString(),

      createdAt:
        note.createdAt?.toISOString() ?? null,

      updatedAt:
        note.updatedAt?.toISOString() ?? null,
    }));

  } catch (error) {
    console.error("Failed to find all notes:", error);

    throw new Error("Failed to fetch notes.");
  }
}

export async function getNoteBySlug(slug) {
  try {
    if (isInvalidText(slug)) {
      return null;
    }

    await dbConnect();

    const noteInfo = await NoteModel.findOne({ slug }).lean();

    // Important: note nahi mila toh null return karo
    if (!noteInfo) {
      return null;
    }

    return {
      ...noteInfo,
      _id: noteInfo._id.toString(),
      owner: noteInfo.owner.toString(),
      createdAt: noteInfo.createdAt?.toISOString() ?? null,
      updatedAt: noteInfo.updatedAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch the info of the note:", error);
    throw new Error("Failed to fetch note info.");
  }
}


export async function deleteNote(slug, userId) {
  try {
    if (
      isInvalidText(slug) ||
      isInvalidText(userId)
    ) {
      return {
        success: false,
        message: "Invalid input.",
      };
    }

    await dbConnect();

    const deletedNote = await NoteModel.findOneAndDelete({
      slug: slug,
      owner: userId,
    });

    if (!deletedNote) {
      return {
        success: false,
        message: "Note not found or you are not authorized.",
      };
    }

    return {
      success: true,
      message: "Note deleted successfully!",
    };

  } catch (error) {
    console.error("Failed to delete note:", error);

    throw new Error("Failed to delete note.");
  }
}

export async function updateNote(slug, userId, updatedData) {
  try {
    if (
      isInvalidText(slug) ||
      isInvalidText(userId) ||
      !updatedData ||
      isInvalidText(updatedData.title) ||
      isInvalidText(updatedData.content) ||
      isInvalidText(updatedData.image)
    ) {
      return {
        success: false,
        message: "Invalid input.",
      };
    }

    await dbConnect();

    const updatedNote = await NoteModel.findOneAndUpdate(
      {
        slug: slug,
        owner: userId,
      },
      {
        $set: {
          title: updatedData.title,
          image: updatedData.image,
          content: xss(updatedData.content),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNote) {
      return {
        success: false,
        message: "Note not found or you are not authorized.",
      };
    }

    return {
      success: true,
      message: "Note updated successfully!",
    };

  } catch (error) {
    console.error("Failed to update note:", error);

    throw new Error("Failed to update note.");
  }
}

export async function getPaginatedNotes(page = 1, limit = 3) {

  try {

    await dbConnect();

    const skip = (page - 1) * limit;

    const [notes, totalNotes] = await Promise.all([

      NoteModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      NoteModel.countDocuments()

    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    return {
      notes: notes.map((note) => ({
        ...note,
        _id: note._id.toString(),
        owner: note.owner.toString(),
        createdAt: note.createdAt?.toISOString() ?? null,
        updatedAt: note.updatedAt?.toISOString() ?? null,
      })),

      totalNotes,
      totalPages,
      currentPage: page,
    };

  } catch (error) {

    console.error("Failed to fetch paginated notes:", error);

    throw new Error("Failed to fetch notes.");

  }

}