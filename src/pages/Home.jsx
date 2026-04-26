import { useMemo, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatsHeader from "../components/StatsHeader.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const STATUS_FILTERS = [
  { id: "all", label: "Alle" },
  { id: "draft", label: "Draft" },
  { id: "ready", label: "Ready" },
  { id: "published", label: "Online" },
];

export default function Home({ items, onOpen }) {
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Vinted Helper</h1>
          <StatsHeader items={items} />
        </div>
        <ThemeToggle />
      </header>

      <div className="mb-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Marke, Titel oder Kategorie..."
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              statusFilter === f.id
                ? "bg-emerald-600 text-white"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-zinc-500 py-12 text-sm">
          Keine Items gefunden.
        </div>
      ) : (
        filtered.map((item) => (
          <ItemCard key={item.item_id} item={item} onOpen={() => onOpen(item.item_id)} />
        ))
      )}
    </div>
  );
}
