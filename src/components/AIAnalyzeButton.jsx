import { Sparkles, Loader2 } from "lucide-react";

export default function AIAnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {loading ? "Analysiere…" : "Mit KI analysieren"}
    </button>
  );
}
