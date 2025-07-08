import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createNote,
  deleteNote,
  getNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);

export default router;
