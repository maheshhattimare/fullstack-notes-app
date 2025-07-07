import express from "express";
import dotenv from "dotenv";
import connetDB from "./config/db.js";
dotenv.config();
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// db connection
connetDB();

// routes
app.get("/", (req, res) => {
  console.log("Done");
  res.send("hello");
});

// run server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
