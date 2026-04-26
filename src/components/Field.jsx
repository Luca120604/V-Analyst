import CopyButton from "./CopyButton.jsx";

export default function Field({ label, value, multiline = false }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
          {label}
        </div>
        <CopyButton value={value} label="Kopieren" />
      </div>
      <div
        className={`text-[14px] text-zinc-900 dark:text-zinc-100 break-words ${
          multiline ? "whitespace-pre-wrap" : ""
        }`}
      >
        {String(value)}
      </div>
    </div>
  );
}
