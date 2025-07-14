import mongoose from "mongoose";
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
      userId: req.user.id,
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

// Get single note
export const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid note ID" });
  }

  try {
    const note = await Note.findOne({ _id: id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid note ID" });
  }

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    return res.status(200).json({ success: true, message: "Note updated", note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({ _id: id, userId: req.user.id });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    await Note.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
