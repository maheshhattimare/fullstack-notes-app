import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createNote,
  deleteNote,
  getNotes,
  getNoteById,
  updateNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.get("/:id", getNoteById); // ✅ View single note
router.post("/", createNote);
router.put("/:id", updateNote); // ✅ Update note
router.delete("/:id", deleteNote);

export default router;
