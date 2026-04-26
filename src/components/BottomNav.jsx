import { Grid3x3, Plus, User } from "lucide-react";

const TABS = [
  { id: "home", label: "Katalog", icon: Grid3x3 },
  { id: "new", label: "Hinzufügen", icon: Plus, primary: true },
  { id: "settings", label: "Profil", icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          if (t.primary) {
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange(t.id)}
                className="flex items-center justify-center"
                style={{ minHeight: 56 }}
                aria-label={t.label}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 active:scale-95 transition">
                  <Icon size={22} strokeWidth={2.4} />
                </span>
              </button>
            );
          }
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
              style={{ minHeight: 56 }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
