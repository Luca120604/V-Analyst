import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import PhotoUpload from "../components/PhotoUpload.jsx";
import AIAnalyzeButton from "../components/AIAnalyzeButton.jsx";
import { emptyItem } from "../lib/schema.js";
import { useAnalyzeImage } from "../hooks/useAnalyzeImage.js";

export default function NewItem({ nextId, modelChoice, onCancel, onCreate }) {
  const [draft, setDraft] = useState(() => emptyItem(nextId));
  const { analyze, loading, error } = useAnalyzeImage();

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  async function runAI() {
    try {
      const items = await analyze(draft.photos, { model: modelChoice });
      if (!items || items.length === 0) {
        alert("KI hat kein Ergebnis geliefert. Bitte erneut versuchen oder manuell ausfüllen.");
        return;
      }
      const first = items[0];
      const filled = {
        ...draft,
        title: first.title || draft.title,
        description: first.description || draft.description,
        category: first.category || draft.category,
        brand: first.brand || draft.brand,
        size: first.size || draft.size,
        condition: first.condition || draft.condition,
        color: first.color || draft.color,
        material: first.material || draft.material,
        price_recommended: first.price_recommended ?? draft.price_recommended,
        price_range: first.price_range || draft.price_range,
        shipping_size: first.shipping_size || draft.shipping_size,
        tags_implicit: first.tags_implicit || draft.tags_implicit,
        notes_for_user: first.notes_for_user || draft.notes_for_user,
        status: "ready",
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      onCreate(filled);
    } catch (e) {
      console.error(e);
    }
  }

  function save() {
    if (!draft.title && !draft.brand && draft.photos.length === 0) {
      alert("Mindestens ein Foto, Titel oder Marke nötig.");
      return;
    }
    onCreate({ ...draft, created_at: Date.now(), updated_at: Date.now() });
  }

  const hasPhotos = draft.photos.length > 0;
  const hasContent = draft.title || draft.brand || hasPhotos;

  return (
    <div>
      <header className="mb-4 -mx-4 px-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200"
          aria-label="Abbrechen"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!hasContent}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-40"
          style={{ minHeight: 40 }}
        >
          <Save size={14} />
          Speichern
        </button>
      </header>

      <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
        Artikel scannen
      </h1>
      <p className="text-[13px] text-zinc-500 mb-5">
        Fotografiere deinen Artikel. Die KI erkennt Marke, Größe, Zustand und schlägt Titel + Preis vor.
      </p>

      <div className="mb-5">
        <PhotoUpload photos={draft.photos} onChange={(photos) => update({ photos })} />
      </div>

      <div className="mb-5">
        <AIAnalyzeButton onClick={runAI} loading={loading} disabled={!hasPhotos} />
        {error && (
          <p className="mt-2 text-[12px] text-red-500 break-words">{error}</p>
        )}
        {!hasPhotos && (
          <p className="mt-2 text-[11px] text-zinc-400 text-center">
            Erst Fotos hinzufügen
          </p>
        )}
      </div>

      <details className="mb-3">
        <summary className="text-[12px] uppercase tracking-wider text-zinc-400 font-medium cursor-pointer select-none">
          Manuell ausfüllen
        </summary>
        <div className="mt-3 space-y-3">
          <SimpleField label="Titel">
            <input
              className="input"
              maxLength={50}
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="z.B. Levi's 501 Jeans dunkelblau W32"
            />
          </SimpleField>
          <SimpleField label="Beschreibung">
            <textarea
              className="input min-h-[100px]"
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </SimpleField>
          <div className="grid grid-cols-2 gap-3">
            <SimpleField label="Marke">
              <input
                className="input"
                value={draft.brand}
                onChange={(e) => update({ brand: e.target.value })}
              />
            </SimpleField>
            <SimpleField label="Größe">
              <input
                className="input"
                value={draft.size}
                onChange={(e) => update({ size: e.target.value })}
              />
            </SimpleField>
            <SimpleField label="Preis (€)">
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={draft.price_recommended || 0}
                onChange={(e) =>
                  update({ price_recommended: Number(e.target.value) || 0 })
                }
              />
            </SimpleField>
            <SimpleField label="Farbe">
              <input
                className="input"
                value={draft.color}
                onChange={(e) => update({ color: e.target.value })}
              />
            </SimpleField>
          </div>
        </div>
      </details>
    </div>
  );
}

function SimpleField({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}
