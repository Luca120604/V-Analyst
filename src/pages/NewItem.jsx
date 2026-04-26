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
      if (items && items.length > 0) {
        const first = items[0];
        update({
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
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function save() {
    if (!draft.title && !draft.brand && draft.photos.length === 0) {
      alert("Mindestens ein Foto, Titel oder Marke nötig.");
      return;
    }
    const now = Date.now();
    onCreate({ ...draft, created_at: now, updated_at: now });
  }

  return (
    <div>
      <header className="mb-4 flex items-center justify-between gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          <ArrowLeft size={18} />
          Abbrechen
        </button>
        <button type="button" onClick={save} className="btn-primary">
          <Save size={16} />
          Speichern
        </button>
      </header>

      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Neues Item</h1>

      <div className="card p-3 mb-3">
        <h2 className="text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Fotos</h2>
        <PhotoUpload
          photos={draft.photos}
          onChange={(photos) => update({ photos })}
        />
      </div>

      <div className="card p-3 mb-3">
        <AIAnalyzeButton
          onClick={runAI}
          loading={loading}
          disabled={draft.photos.length === 0}
        />
        {error && (
          <p className="mt-2 text-xs text-red-500 break-words">{error}</p>
        )}
        {draft.photos.length === 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            Erst Fotos hinzufügen, dann KI-Analyse starten.
          </p>
        )}
      </div>

      <div className="card p-3 mb-3 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Manuell ausfüllen</h2>
        <SimpleField label="Titel">
          <input
            className="input"
            maxLength={50}
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="[Marke] [Item] [Merkmal] [Größe]"
          />
        </SimpleField>
        <SimpleField label="Beschreibung">
          <textarea
            className="input min-h-[120px]"
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </SimpleField>
        <div className="grid grid-cols-2 gap-3">
          <SimpleField label="Marke">
            <input className="input" value={draft.brand} onChange={(e) => update({ brand: e.target.value })} />
          </SimpleField>
          <SimpleField label="Größe">
            <input className="input" value={draft.size} onChange={(e) => update({ size: e.target.value })} />
          </SimpleField>
          <SimpleField label="Preis (€)">
            <input
              type="number"
              inputMode="decimal"
              className="input"
              value={draft.price_recommended || 0}
              onChange={(e) => update({ price_recommended: Number(e.target.value) || 0 })}
            />
          </SimpleField>
          <SimpleField label="Farbe">
            <input className="input" value={draft.color} onChange={(e) => update({ color: e.target.value })} />
          </SimpleField>
        </div>
      </div>
    </div>
  );
}

function SimpleField({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">{label}</div>
      {children}
    </label>
  );
}
