const STYLES = {
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  ready: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const LABELS = { draft: "Entwurf", ready: "Bereit", published: "Online" };

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || STYLES.draft;
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {LABELS[status] || status}
    </span>
  );
}
