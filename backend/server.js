import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askAI } from "./ai.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const reply = await askAI(message, "chat");
  res.json({ reply });
});

app.post("/generate", async (req, res) => {
  const { message } = req.body;

  const reply = await askAI(message, "generate");
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
