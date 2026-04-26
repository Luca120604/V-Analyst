import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Theme umschalten"
      className="shrink-0 p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      style={{ minHeight: 44, minWidth: 44 }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
