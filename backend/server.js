import express from "express";
import cors from "cors";
import { askAI } from "./ai.js";

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [];

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  chatHistory.push({ role: "user", content: userMsg });

  const reply = await askAI(chatHistory);

  chatHistory.push({ role: "assistant", content: reply });

  res.json({ reply });
});

app.listen(3000, () => console.log("Server running"));