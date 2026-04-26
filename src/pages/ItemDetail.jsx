import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Field from "../components/Field.jsx";
import CopyButton from "../components/CopyButton.jsx";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import PhotoUpload from "../components/PhotoUpload.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { CONDITIONS, SHIPPING_SIZES, STATUSES } from "../lib/schema.js";
import { VINTED_CATEGORIES } from "../lib/vintedCategories.js";

export default function ItemDetail({ item, onBack, onSave, onDelete }) {
  const [draft, setDraft] = useState(item);
  const [editing, setEditing] = useState(false);

  useEffect(() => setDraft(item), [item]);

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  function save() {
    onSave({ ...draft, updated_at: Date.now() });
    setEditing(false);
  }

  if (!item) return null;

  const fullBlock = `${draft.title}\n\n${draft.description}`;

  return (
    <div>
      <header className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-ghost"
          aria-label="Zurück"
        >
          <ArrowLeft size={18} />
          Zurück
        </button>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button type="button" onClick={() => setEditing(true)} className="btn-secondary">
              Bearbeiten
            </button>
          ) : (
            <button type="button" onClick={save} className="btn-primary">
              <Save size={16} />
              Speichern
            </button>
          )}
        </div>
      </header>

      <div className="card p-3 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-zinc-500">#{draft.item_id}</span>
          <StatusBadge status={draft.status} />
        </div>
        <PhotoCarousel photos={draft.photos} />
        {editing && (
          <div className="mt-3">
            <PhotoUpload
              photos={draft.photos || []}
              onChange={(photos) => update({ photos })}
            />
          </div>
        )}
      </div>

      <div className="card p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Listing</h2>
          <CopyButton value={fullBlock} label="Titel + Beschreibung" size="lg" />
        </div>

        {editing ? (
          <EditForm draft={draft} update={update} />
        ) : (
          <ReadView draft={draft} />
        )}

        {draft.notes_for_user && (
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 italic">
            Hinweis: {draft.notes_for_user}
          </div>
        )}
      </div>

      <div className="card p-3 mb-3">
        <h2 className="text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Status</h2>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSave({ ...draft, status: s, updated_at: Date.now() })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                draft.status === s
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {s === "draft" ? "Draft" : s === "ready" ? "Ready" : "Online"}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm("Item wirklich löschen?")) onDelete(draft.item_id);
        }}
        className="btn-ghost text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 size={16} />
        Löschen
      </button>
    </div>
  );
}

function ReadView({ draft }) {
  return (
    <>
      <Field label="Titel" value={draft.title} />
      <Field label="Beschreibung" value={draft.description} multiline />
      <Field label="Kategorie" value={draft.category} />
      <Field label="Marke" value={draft.brand} />
      <Field label="Größe" value={draft.size} />
      <Field label="Zustand" value={draft.condition} />
      <Field label="Farbe" value={draft.color} />
      <Field label="Material" value={draft.material} />
      <Field label="Preis" value={draft.price_recommended ? `${draft.price_recommended} €` : ""} />
      <Field label="Range" value={draft.price_range} />
      <Field label="Versand" value={draft.shipping_size} />
    </>
  );
}

function EditForm({ draft, update }) {
  return (
    <div className="space-y-3">
      <FormField label="Titel">
        <input
          className="input"
          value={draft.title || ""}
          maxLength={50}
          onChange={(e) => update({ title: e.target.value })}
        />
        <span className="text-[10px] text-zinc-500">{(draft.title || "").length}/50</span>
      </FormField>
      <FormField label="Beschreibung">
        <textarea
          className="input min-h-[140px]"
          value={draft.description || ""}
          onChange={(e) => update({ description: e.target.value })}
        />
      </FormField>
      <FormField label="Kategorie">
        <select
          className="input"
          value={draft.category || ""}
          onChange={(e) => update({ category: e.target.value })}
        >
          <option value="">— wählen —</option>
          {VINTED_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Marke">
          <input
            className="input"
            value={draft.brand || ""}
            onChange={(e) => update({ brand: e.target.value })}
          />
        </FormField>
        <FormField label="Größe">
          <input
            className="input"
            value={draft.size || ""}
            onChange={(e) => update({ size: e.target.value })}
          />
        </FormField>
        <FormField label="Zustand">
          <select
            className="input"
            value={draft.condition || ""}
            onChange={(e) => update({ condition: e.target.value })}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Versand">
          <select
            className="input"
            value={draft.shipping_size || "Mittel"}
            onChange={(e) => update({ shipping_size: e.target.value })}
          >
            {SHIPPING_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Farbe">
          <input
            className="input"
            value={draft.color || ""}
            onChange={(e) => update({ color: e.target.value })}
          />
        </FormField>
        <FormField label="Material">
          <input
            className="input"
            value={draft.material || ""}
            onChange={(e) => update({ material: e.target.value })}
          />
        </FormField>
        <FormField label="Preis (€)">
          <input
            type="number"
            inputMode="decimal"
            className="input"
            value={draft.price_recommended ?? 0}
            onChange={(e) => update({ price_recommended: Number(e.target.value) || 0 })}
          />
        </FormField>
        <FormField label="Range">
          <input
            className="input"
            value={draft.price_range || ""}
            onChange={(e) => update({ price_range: e.target.value })}
            placeholder="z.B. 15-22 €"
          />
        </FormField>
      </div>
      <FormField label="Notiz">
        <textarea
          className="input min-h-[60px]"
          value={draft.notes_for_user || ""}
          onChange={(e) => update({ notes_for_user: e.target.value })}
        />
      </FormField>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">{label}</div>
      {children}
    </label>
  );
}
