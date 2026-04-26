import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Pencil } from "lucide-react";
import Field from "../components/Field.jsx";
import CopyButton from "../components/CopyButton.jsx";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import PhotoUpload from "../components/PhotoUpload.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { CONDITIONS, SHIPPING_SIZES, STATUSES } from "../lib/schema.js";
import { VINTED_CATEGORIES } from "../lib/vintedCategories.js";

const STATUS_LABELS = { draft: "Entwurf", ready: "Bereit", published: "Online" };

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
      <header className="mb-4 -mx-4 px-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200"
          aria-label="Zurück"
        >
          <ArrowLeft size={20} />
        </button>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            style={{ minHeight: 40 }}
          >
            <Pencil size={14} />
            Bearbeiten
          </button>
        ) : (
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
            style={{ minHeight: 40 }}
          >
            <Save size={14} />
            Speichern
          </button>
        )}
      </header>

      <div className="-mx-4 mb-4">
        <PhotoCarousel photos={draft.photos} />
      </div>

      {editing && (
        <div className="mb-4">
          <PhotoUpload
            photos={draft.photos || []}
            onChange={(photos) => update({ photos })}
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={draft.status} />
        <span className="text-[11px] text-zinc-400 font-mono">#{draft.item_id}</span>
      </div>

      <h1 className="text-[20px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">
        {draft.title || "Ohne Titel"}
      </h1>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-[22px] font-bold text-zinc-900 dark:text-zinc-100">
          {draft.price_recommended || 0} €
        </span>
        {draft.price_range && (
          <span className="text-[12px] text-zinc-500">{draft.price_range}</span>
        )}
      </div>

      <div className="mb-5">
        <CopyButton value={fullBlock} label="Für Vinted kopieren" variant="primary" />
      </div>

      {editing ? (
        <div className="mb-4">
          <EditForm draft={draft} update={update} />
        </div>
      ) : (
        <div className="mb-4">
          <ReadView draft={draft} />
        </div>
      )}

      {draft.notes_for_user && !editing && (
        <div className="mb-4 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-[12px] text-amber-700 dark:text-amber-300">
          {draft.notes_for_user}
        </div>
      )}

      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-2">
          Status
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSave({ ...draft, status: s, updated_at: Date.now() })}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition ${
                draft.status === s
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm("Artikel wirklich löschen?")) onDelete(draft.item_id);
        }}
        className="inline-flex items-center gap-1.5 text-[13px] text-red-600 dark:text-red-400 px-2 py-2"
      >
        <Trash2 size={14} />
        Löschen
      </button>
    </div>
  );
}

function ReadView({ draft }) {
  return (
    <>
      <Field label="Beschreibung" value={draft.description} multiline />
      <Field label="Marke" value={draft.brand} />
      <Field label="Größe" value={draft.size} />
      <Field label="Zustand" value={draft.condition} />
      <Field label="Farbe" value={draft.color} />
      <Field label="Material" value={draft.material} />
      <Field label="Kategorie" value={draft.category} />
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
        <span className="text-[10px] text-zinc-400">{(draft.title || "").length}/50</span>
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
        <FormField label="Preis-Range">
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
      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}
