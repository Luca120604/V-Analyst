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
    a.download = `vinted-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-5">
        Profil
      </h1>

      <Section title="KI-Modell">
        <div className="flex gap-2">
          <ModelOption
            current={modelChoice}
            value="flash"
            label="Schnell"
            sub="Gemini Flash · gratis"
            onClick={() => setModelChoice("flash")}
          />
          <ModelOption
            current={modelChoice}
            value="pro"
            label="Genau"
            sub="Gemini Pro · langsamer"
            onClick={() => setModelChoice("pro")}
          />
        </div>
      </Section>

      <Section title="API-Endpoint">
        <div className="text-[12px] text-zinc-500 break-all font-mono">{workerUrl}</div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Cloudflare Worker, der den Gemini-Key sicher hält.
        </p>
      </Section>

      <Section title="Daten">
        <div className="space-y-2">
          <Action onClick={exportJson} icon={Download}>
            Daten exportieren ({items.length})
          </Action>
          <Action onClick={onResetSeed} icon={RefreshCw}>
            Demo-Artikel laden
          </Action>
          <Action
            onClick={() => {
              if (confirm("Wirklich alle Artikel löschen?")) onClearAll();
            }}
            icon={Trash2}
            danger
          >
            Alles löschen
          </Action>
        </div>
      </Section>

      <p className="text-[11px] text-zinc-400 text-center mt-8">
        Vinted Helper · Daten leben nur in deinem Browser.
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Action({ onClick, icon: Icon, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition active:scale-[0.99] ${
        danger
          ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
          : "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
      }`}
      style={{ minHeight: 48 }}
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

function ModelOption({ current, value, label, sub, onClick }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-3 rounded-xl text-left transition active:scale-[0.98] ${
        active
          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          : "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
      }`}
    >
      <div className="text-[14px] font-semibold">{label}</div>
      <div className={`text-[11px] mt-0.5 ${active ? "opacity-70" : "text-zinc-500"}`}>
        {sub}
      </div>
    </button>
  );
}
