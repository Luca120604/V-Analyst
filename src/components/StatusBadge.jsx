const STYLES = {
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  ready: "bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  published: "bg-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const LABELS = { draft: "Draft", ready: "Ready", published: "Online" };

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || STYLES.draft;
  return (
    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded font-medium ${cls}`}>
      {LABELS[status] || status}
    </span>
  );
}
