import CopyButton from "./CopyButton.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { ChevronRight, ImageOff } from "lucide-react";

export default function ItemCard({ item, onOpen }) {
  const fullBlock = `${item.title}\n\n${item.description}`;
  const cover = item.photos?.[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left card p-3 mb-3 active:scale-[0.99] transition"
    >
      <div className="flex gap-3">
        <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          {cover ? (
            <img src={cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageOff size={20} className="text-zinc-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-zinc-500">#{item.item_id}</span>
            <StatusBadge status={item.status} />
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">
              {item.condition}
            </span>
          </div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {item.title || "(Ohne Titel)"}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-500 truncate">
              {item.brand || "—"} · {item.size || "—"} ·{" "}
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                {item.price_recommended || 0} €
              </span>
            </div>
            <ChevronRight size={16} className="text-zinc-400 shrink-0" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
        <CopyButton value={fullBlock} label="Titel + Beschreibung" />
      </div>
    </button>
  );
}
