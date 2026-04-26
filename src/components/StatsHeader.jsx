export default function StatsHeader({ items }) {
  const total = items.length;
  const ready = items.filter((i) => i.status === "ready" || i.status === "published").length;
  const totalValue = items.reduce((s, i) => s + (Number(i.price_recommended) || 0), 0);
  const readyValue = items
    .filter((i) => i.status === "ready" || i.status === "published")
    .reduce((s, i) => s + (Number(i.price_recommended) || 0), 0);

  return (
    <p className="text-xs sm:text-sm text-zinc-500">
      {total} Items · {ready} ready ·{" "}
      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{readyValue} €</span> /{" "}
      {totalValue} € Potenzial
    </p>
  );
}
