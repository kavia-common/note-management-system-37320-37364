"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (input: { id?: string; title: string; content: string }) => void;
  note?: Note;
};

// PUBLIC_INTERFACE
export default function NoteEditor({ open, onClose, onSave, note }: Props) {
  /** Modal/drawer editor for creating or editing notes. */
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function save() {
    onSave({ id: note?.id, title: title.trim(), content: content.trim() });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative w-full md:w-[720px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="editor-title" className="text-xl font-semibold">
            {note ? "Edit Note" : "New Note"}
          </h2>
          <button
            aria-label="Close editor"
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l10 10M16 6L6 16" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="ocean-input"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here…"
              className="ocean-textarea"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="ocean-btn bg-gray-100 text-gray-800 hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="ocean-btn-primary"
            onClick={save}
            disabled={!title.trim()}
            aria-disabled={!title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
