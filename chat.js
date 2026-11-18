const FREE_MODELS = new Set([
  "kafox-free",
  "deepseek-freemium",
  "command-a-03-2025",
  "command-r7b-12-2024",
  "command-a-plus-05-2026",
  "command-a-reasoning-08-2025",
  "nvidia/nemotron-3.5-bolt-e4b",
  "nvidia/nemotron-3.5-super-vl-120b-a12b",
  "dots-studio/dots-3-note-preview:free",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "allam-2-7b",
  "nvidia/nemotron-3.5-lightning-30b-a3b",
  "openrouter/free",
  "nvidia/nemotron-3.5-lightning:free",
  "cohere/north-mini-code:free",
  "poolside/laguna-s-2.1:free",
  "xingchen-agi/xing4.0-29b-a4b:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "gemma-4-31B-it",
  "glm-5.3-flash",
  "glm-4.5-flash"
]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.KAFOX_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Configure KAFOX_API_KEY nas Environment Variables da Vercel."
    });
  }

  const { messages, model } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 60) {
    return res.status(400).json({ error: "Histórico de mensagens inválido." });
  }

  const selectedModel = FREE_MODELS.has(model) ? model : "kafox-free";
  const safeMessages = messages.map((m) => ({
    role: ["user", "assistant"].includes(m?.role) ? m.role : "user",
    content: String(m?.content || "").slice(0, 12000)
  }));

  try {
    const upstream = await fetch("https://api.kafox.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: safeMessages,
        temperature: 0.7
      })
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || data?.message || `A Kafox retornou HTTP ${upstream.status}.`
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string") {
      return res.status(502).json({ error: "Resposta da API em formato inesperado." });
    }
    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: "Não foi possível conectar à API Kafox." });
  }
}
