// clarifai_test.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const CLARIFAI_KEY = "547f1afe5f224e5fa87dca2caf99b965"; // 🔑 Reemplaza por tu token real

(async () => {
  try {
    const res = await fetch("https://api.clarifai.com/v2/ext/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Key ${CLARIFAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "https://clarifai.com/openai/chat-completion/models/gpt-oss-120b",
        messages: [
          { role: "user", content: "Hola, ¿qué es Scrum?" }
        ],
      }),
    });

    const data = await res.json();
    console.log("✅ Respuesta Clarifai:\n", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error conectando con Clarifai:", err);
  }
})();

