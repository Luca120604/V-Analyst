import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ value, label = "Kopieren", variant = "subtle", icon = true }) {
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

  const variants = {
    subtle:
      "px-2 py-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300",
    primary:
      "w-full justify-center px-4 py-3 text-sm bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100",
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full font-medium transition active:scale-[0.98] ${variants[variant]} ${
        copied ? "!bg-emerald-600 !text-white" : ""
      }`}
      style={variant === "primary" ? { minHeight: 48 } : undefined}
    >
      {icon && (copied ? <Check size={variant === "primary" ? 16 : 12} /> : <Copy size={variant === "primary" ? 16 : 12} />)}
      {copied ? "Kopiert" : label}
    </button>
  );
}
