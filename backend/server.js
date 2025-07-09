import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import connetDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/noteRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// db connection
connetDB();

// routes
app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);

// to solve render shutdown problem
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// run server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
