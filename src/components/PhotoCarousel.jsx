import { ImageOff } from "lucide-react";

export default function PhotoCarousel({ photos = [] }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-video rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
        <ImageOff size={28} />
      </div>
    );
  }
  return (
    <div className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-2 scrollbar-thin">
      {photos.map((p, i) => (
        <div
          key={i}
          className="snap-center shrink-0 w-[80vw] max-w-[480px] aspect-square rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        >
          <img src={p} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
