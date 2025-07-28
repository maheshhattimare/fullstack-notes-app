import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createNote,
  deleteNote,
  getNotes,
  getNoteById,
  updateNote,
  toggleNotePinStatus,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", toggleNotePinStatus);

export default router;
