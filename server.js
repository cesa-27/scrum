// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CLARIFAI_KEY = "547f1afe5f224e5fa87dca2caf99b965"; // 🔑 tu token Clarifai

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.clarifai.com/v2/ext/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Key ${CLARIFAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "https://clarifai.com/openai/chat-completion/models/gpt-oss-120b",
        messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error Clarifai:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(3001, () => console.log("🚀 Servidor backend escuchando en http://localhost:3001"));
