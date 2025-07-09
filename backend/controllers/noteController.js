import Note from "../models/Note.js";

// Create a new note
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const newNote = new Note({
      title,
      content,
      userId: req.user.id, //from JWT middleware
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a note by ID
export const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId });

    return res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
