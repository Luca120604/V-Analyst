import CopyButton from "./CopyButton.jsx";

export default function Field({ label, value, multiline = false }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
      <div className="w-24 sm:w-28 shrink-0 text-[10px] sm:text-xs uppercase tracking-wide text-zinc-500 pt-1">
        {label}
      </div>
      <div
        className={`flex-1 text-sm text-zinc-900 dark:text-zinc-100 break-words ${
          multiline ? "whitespace-pre-wrap" : ""
        }`}
      >
        {String(value)}
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}
