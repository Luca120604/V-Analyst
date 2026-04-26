import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ value, label = "Copy", size = "sm" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e?.stopPropagation?.();
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const cls =
    size === "lg"
      ? "px-3 py-2 text-sm"
      : "px-2 py-1 text-xs";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Kopiere ${label}`}
      className={`shrink-0 inline-flex items-center gap-1 rounded font-medium transition ${cls} ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200"
      }`}
    >
      {copied ? <Check size={size === "lg" ? 14 : 12} /> : <Copy size={size === "lg" ? 14 : 12} />}
      {copied ? "Kopiert" : "Copy"}
    </button>
  );
}
