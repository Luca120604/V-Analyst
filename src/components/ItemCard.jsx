import { ImageOff } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function ItemCard({ item, onOpen }) {
  const cover = item.photos?.[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group text-left active:scale-[0.98] transition"
    >
      <div className="relative aspect-square rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <ImageOff size={24} />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
          {item.brand && item.brand !== "Unbekannt" ? item.brand : "Ohne Marke"}
        </div>
        <div className="flex items-baseline justify-between gap-2 mt-0.5">
          <div className="text-[11px] text-zinc-500 truncate">
            {item.size || "—"}
          </div>
          <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
            {item.price_recommended || 0} €
          </div>
        </div>
      </div>
    </button>
  );
}
