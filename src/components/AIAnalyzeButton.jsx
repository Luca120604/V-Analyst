import { Sparkles, Loader2 } from "lucide-react";

export default function AIAnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-sm font-semibold transition active:scale-[0.98] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ minHeight: 52 }}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
      {loading ? "Artikel wird analysiert…" : "Artikel analysieren"}
    </button>
  );
}
