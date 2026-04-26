export default function StatsHeader({ items }) {
  const total = items.length;
  const ready = items.filter((i) => i.status === "ready" || i.status === "published").length;
  const totalValue = items.reduce((s, i) => s + (Number(i.price_recommended) || 0), 0);

  return (
    <p className="text-[12px] text-zinc-500 mt-0.5">
      {total} Artikel · {ready} bereit ·{" "}
      <span className="text-zinc-900 dark:text-zinc-100 font-medium">{totalValue} €</span>
    </p>
  );
}
