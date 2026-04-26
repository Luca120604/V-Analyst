export const CONDITIONS = [
  "Neu, mit Etikett",
  "Neu",
  "Sehr gut",
  "Gut",
  "Zufriedenstellend",
];

export const SHIPPING_SIZES = ["Klein", "Mittel", "Groß"];

export const STATUSES = ["draft", "ready", "published"];

export function emptyItem(nextId = 1) {
  const now = Date.now();
  return {
    item_id: nextId,
    title: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    condition: "Gut",
    color: "",
    material: "",
    price_recommended: 0,
    price_range: "",
    shipping_size: "Mittel",
    tags_implicit: [],
    notes_for_user: "",
    photos: [],
    status: "draft",
    created_at: now,
    updated_at: now,
    _uncertain_fields: [],
  };
}

export function normalizeItem(raw, fallbackId = 1) {
  const base = emptyItem(fallbackId);
  return {
    ...base,
    ...raw,
    item_id: raw.item_id ?? base.item_id,
    photos: Array.isArray(raw.photos) ? raw.photos : [],
    tags_implicit: Array.isArray(raw.tags_implicit) ? raw.tags_implicit : [],
    _uncertain_fields: Array.isArray(raw._uncertain_fields) ? raw._uncertain_fields : [],
    status: raw.status || "draft",
    created_at: raw.created_at || Date.now(),
    updated_at: raw.updated_at || Date.now(),
  };
}

export function nextItemId(items) {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((i) => i.item_id || 0)) + 1;
}
