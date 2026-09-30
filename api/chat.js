import process from "node:process";

const sendJson = (response, status, body) => {
  response.status(status).setHeader("Cache-Control", "no-store").json(body);
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST to send a chat message." });
    return;
  }

  const apiKey = process.env.GEMINI || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(response, 500, { error: "The GEMINI_API_KEY environment variable is missing in Vercel." });
    return;
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      sendJson(response, 400, { error: "Add a message before sending." });
      return;
    }

    const transcript = messages
      .filter((message) =>
        (message.sender === "user" || message.sender === "ai") &&
        typeof message.text === "string"
      )
      .map((message) => `${message.sender === "ai" ? "Assistant" : "User"}: ${message.text}`)
      .join("\n\n");

    if (!transcript || transcript.length > 100_000) {
      sendJson(response, 400, { error: "This conversation is empty or too long to send." });
      return;
    }

    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "gemini-3.5-flash-lite",
        input: `Continue this conversation and answer the latest user message.\n\n${transcript}`,
        store: false,
      }),
    });

    const result = await geminiResponse.json().catch(() => null);
    if (!geminiResponse.ok) {
      sendJson(response, 502, { error: result?.error?.message || "Gemini could not complete the request." });
      return;
    }

    const answer = result?.output_text || result?.steps
      ?.flatMap((step) => step.content || [])
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    if (!answer) {
      sendJson(response, 502, { error: "Gemini returned an empty response. Please try again." });
      return;
    }

    sendJson(response, 200, { answer });
  } catch {
    sendJson(response, 500, { error: "Could not send your message. Please try again." });
  }
}
