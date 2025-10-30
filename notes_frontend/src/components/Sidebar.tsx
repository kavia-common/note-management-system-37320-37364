"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onCreate: () => void;
  loading?: boolean;
};

// PUBLIC_INTERFACE
export default function Sidebar({ value, onChange, onCreate, loading }: Props) {
  /** Sidebar with search box and create button */
  return (
    <div className="ocean-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">Search</h2>
        <span className="text-xs text-gray-500">{loading ? "Loading…" : ""}</span>
      </div>
      <input
        aria-label="Search notes"
        placeholder="Search by title or content…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ocean-input"
      />
      <div className="mt-4">
        <button onClick={onCreate} className="ocean-btn-primary w-full">
          New Note
        </button>
      </div>
      <div className="mt-6">
        <p className="text-xs text-gray-500">
          Tip: Use keywords to quickly filter notes. Click a note to edit.
        </p>
      </div>
    </div>
  );
}
