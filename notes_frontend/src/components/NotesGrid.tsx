"use client";

import { Note } from "@/lib/api";
import NoteCard from "./NoteCard";

type Props = {
  notes: Note[];
  loading?: boolean;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
};

// PUBLIC_INTERFACE
export default function NotesGrid({ notes, loading, onSelect, onDelete }: Props) {
  /** Responsive grid of notes with loading/empty states. */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="ocean-card p-4 animate-pulse"
            aria-busy="true"
            aria-label="Loading note"
          >
            <div className="h-5 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="ocean-card p-8 text-center text-gray-600">
        <p className="text-base">No notes yet.</p>
        <p className="text-sm mt-1">Click “New Note” or the + button to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} onClick={onSelect} onDelete={onDelete} />
      ))}
    </div>
  );
}
