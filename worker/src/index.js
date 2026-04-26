import { SYSTEM_PROMPT, ITEM_RESPONSE_SCHEMA } from "./prompt.js";

const MODEL_MAP = {
  flash: "gemini-2.5-flash",
  pro: "gemini-2.5-pro",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return jsonResponse({
        ok: true,
        service: "vinted-helper-api",
        endpoints: ["POST /analyze"],
      });
    }

    if (request.method === "POST" && url.pathname === "/analyze") {
      return handleAnalyze(request, env);
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
};

async function handleAnalyze(request, env) {
  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: "GEMINI_API_KEY not configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { images, model = "flash" } = body || {};
  if (!Array.isArray(images) || images.length === 0) {
    return jsonResponse({ error: "Provide images: [{mimeType, data}]" }, 400);
  }

  const geminiModel = MODEL_MAP[model] || MODEL_MAP.flash;

  const parts = [
    { text: "Analysiere die folgenden Bilder und liefere ein JSON-Array von Items entsprechend dem Schema." },
    ...images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType || "image/jpeg",
        data: img.data,
      },
    })),
  ];

  const requestBody = {
    contents: [{ role: "user", parts }],
    systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: ITEM_RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${env.GEMINI_API_KEY}`;

  let upstream;
  try {
    upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
  } catch (e) {
    return jsonResponse({ error: `Gemini fetch failed: ${e.message}` }, 502);
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return jsonResponse({ error: "Gemini error", status: upstream.status, detail: text }, 502);
  }

  let data;
  try {
    data = await upstream.json();
  } catch (e) {
    return jsonResponse({ error: `Gemini JSON parse failed: ${e.message}` }, 502);
  }

  const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  let items;
  try {
    items = JSON.parse(textOut);
    if (!Array.isArray(items)) items = [items];
  } catch (e) {
    return jsonResponse(
      { error: "Could not parse Gemini output as JSON", raw: textOut },
      502
    );
  }

  return jsonResponse({ items, model: geminiModel });
}
