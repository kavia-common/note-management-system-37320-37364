"use client";

import { Note } from "@/lib/api";

type Props = {
  note: Note;
  onClick: (n: Note) => void;
  onDelete: (id: string) => void;
};

// PUBLIC_INTERFACE
export default function NoteCard({ note, onClick, onDelete }: Props) {
  /** Card representation of a note with title, excerpt, and actions. */
  const excerpt =
    note.content.length > 140 ? note.content.slice(0, 137) + "…" : note.content;

  return (
    <article
      className="ocean-card p-4 flex flex-col gap-3 group cursor-pointer"
      onClick={() => onClick(note)}
      role="button"
      aria-label={`Open note ${note.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(note);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {note.title || "Untitled"}
        </h3>
        <button
          className="text-gray-400 hover:text-red-600 transition-colors -mr-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          aria-label="Delete note"
          title="Delete note"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h14M8 6v10m4-10v10M5 6l1-2h8l1 2M6 16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{excerpt || "No content yet"}</p>
      <div className="flex items-center justify-between">
        <span className="ocean-badge">Updated {new Date(note.updatedAt).toLocaleString()}</span>
      </div>
    </article>
  );
}
