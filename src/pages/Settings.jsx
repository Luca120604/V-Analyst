import { Download, Trash2, RefreshCw } from "lucide-react";

export default function Settings({
  items,
  onResetSeed,
  onClearAll,
  modelChoice,
  setModelChoice,
}) {
  const workerUrl = import.meta.env.VITE_WORKER_URL || "(nicht gesetzt)";

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinted-items-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Settings</h1>

      <Section title="KI-Modell">
        <div className="flex gap-2">
          <ModelOption
            current={modelChoice}
            value="flash"
            label="Gemini Flash"
            sub="Schnell, gratis"
            onClick={() => setModelChoice("flash")}
          />
          <ModelOption
            current={modelChoice}
            value="pro"
            label="Gemini Pro"
            sub="Genauer, langsamer"
            onClick={() => setModelChoice("pro")}
          />
        </div>
      </Section>

      <Section title="Worker">
        <div className="text-xs text-zinc-500 break-all">{workerUrl}</div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Setze VITE_WORKER_URL in Cloudflare Pages env vars (Production) oder lokal in .env.
        </p>
      </Section>

      <Section title="Daten">
        <div className="space-y-2">
          <button type="button" onClick={exportJson} className="btn-secondary w-full">
            <Download size={16} />
            JSON Export ({items.length} Items)
          </button>
          <button type="button" onClick={onResetSeed} className="btn-secondary w-full">
            <RefreshCw size={16} />
            Mit Demo-Daten überschreiben
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Wirklich ALLE Items löschen?")) onClearAll();
            }}
            className="btn-ghost w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={16} />
            Alle Items löschen
          </button>
        </div>
      </Section>

      <p className="text-[11px] text-zinc-500 text-center mt-6">
        Vinted Helper · Daten leben nur in deinem Browser (localStorage).
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-3 mb-3">
      <h2 className="text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-100">{title}</h2>
      {children}
    </div>
  );
}

function ModelOption({ current, value, label, sub, onClick }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-2.5 rounded-lg border text-left transition ${
        active
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
          : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      }`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-[11px] text-zinc-500">{sub}</div>
    </button>
  );
}
