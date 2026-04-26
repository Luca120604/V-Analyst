import { useRef, useState } from "react";
import { Camera, ImagePlus, X, Loader2 } from "lucide-react";

const MAX_EDGE = 1280;
const QUALITY = 0.82;

async function fileToCompressedDataUrl(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const ratio = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * ratio);
    const h = Math.round(img.naturalHeight * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function PhotoUpload({ photos, onChange, max = 8 }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const list = Array.from(files).slice(0, max - photos.length);
      const compressed = [];
      for (const f of list) {
        try {
          const data = await fileToCompressedDataUrl(f);
          compressed.push(data);
        } catch (e) {
          console.error("Compress failed", e);
        }
      }
      onChange([...photos, ...compressed]);
    } finally {
      setBusy(false);
    }
  }

  function removePhoto(idx) {
    onChange(photos.filter((_, i) => i !== idx));
  }

  const canAdd = photos.length < max;

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-md overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
            <img src={p} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-zinc-900/80 text-white"
              aria-label="Foto entfernen"
            >
              <X size={14} />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-zinc-900/80 text-white">
                Cover
              </span>
            )}
          </div>
        ))}
        {canAdd && (
          <>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={busy}
              className="aspect-square rounded-md bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-1 text-zinc-500 active:scale-[0.98] transition"
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              <span className="text-[10px] uppercase tracking-wider">Kamera</span>
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              disabled={busy}
              className="aspect-square rounded-md bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-1 text-zinc-500 active:scale-[0.98] transition"
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              <span className="text-[10px] uppercase tracking-wider">Galerie</span>
            </button>
          </>
        )}
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="mt-2 text-[11px] text-zinc-400">
        {photos.length}/{max} · komprimiert auf max. 1280px
      </p>
    </div>
  );
}
