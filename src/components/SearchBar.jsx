import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Suchen..." }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600"
          aria-label="Suche leeren"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
