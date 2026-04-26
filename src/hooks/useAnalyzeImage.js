import { useState } from "react";

const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";

function stripDataUrl(dataUrl) {
  const match = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(dataUrl || "");
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export function useAnalyzeImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze(photos, { model = "flash" } = {}) {
    setError(null);
    if (!WORKER_URL) {
      const msg =
        "VITE_WORKER_URL nicht gesetzt. Setze sie in .env oder in Cloudflare Pages env vars.";
      setError(msg);
      throw new Error(msg);
    }
    if (!photos || photos.length === 0) {
      const msg = "Keine Fotos zum Analysieren.";
      setError(msg);
      throw new Error(msg);
    }
    const images = photos
      .map((p) => stripDataUrl(p))
      .filter(Boolean);
    if (images.length === 0) {
      const msg = "Konnte Fotos nicht lesen (kein gültiges DataURL-Format).";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    try {
      const res = await fetch(`${WORKER_URL.replace(/\/$/, "")}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, model }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Worker ${res.status}: ${text}`);
      }
      const data = await res.json();
      return Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    } catch (e) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
