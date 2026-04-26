import { useMemo, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatsHeader from "../components/StatsHeader.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const STATUS_FILTERS = [
  { id: "all", label: "Alle" },
  { id: "draft", label: "Entwurf" },
  { id: "ready", label: "Bereit" },
  { id: "published", label: "Online" },
];

export default function Home({ items, onOpen, onAdd }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items
      .filter((i) => statusFilter === "all" || i.status === statusFilter)
      .filter((i) => {
        if (!q) return true;
        return (
          (i.title || "").toLowerCase().includes(q) ||
          (i.brand || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
  }, [items, query, statusFilter]);

  return (
    <div>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Katalog
          </h1>
          <StatsHeader items={items} />
        </div>
        <ThemeToggle />
      </header>

      <div className="mb-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Marke, Titel, Kategorie" />
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition ${
              statusFilter === f.id
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((item) => (
            <ItemCard key={item.item_id} item={item} onOpen={() => onOpen(item.item_id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        Noch keine Artikel
      </div>
      <p className="text-[13px] text-zinc-500 mb-5">
        Foto machen, KI generiert Titel, Beschreibung und Preisidee.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold"
        style={{ minHeight: 44 }}
      >
        Artikel scannen
      </button>
    </div>
  );
}
