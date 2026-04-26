import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function PhotoCarousel({ photos = [] }) {
  const [active, setActive] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
        <ImageOff size={28} />
      </div>
    );
  }

  function handleScroll(e) {
    const w = e.currentTarget.clientWidth;
    const idx = Math.round(e.currentTarget.scrollLeft / w);
    if (idx !== active) setActive(idx);
  }

  return (
    <div className="relative">
      <div
        className="overflow-x-auto snap-x snap-mandatory flex scrollbar-thin"
        onScroll={handleScroll}
      >
        {photos.map((p, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-full aspect-square bg-zinc-100 dark:bg-zinc-900"
          >
            <img
              src={p}
              alt={`Foto ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition ${
                i === active ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
