"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import NotesGrid from "@/components/NotesGrid";
import NoteEditor from "@/components/NoteEditor";
import { API, Note } from "@/lib/api";

export default function Home() {
  const api = useMemo(() => new API(), []);
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Note | null>(null);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load notes on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.listNotes();
        if (!cancelled) setNotes(list);
        setApiHealthy(api.isRemote());
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load notes";
        setError(message);
        setApiHealthy(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  function openCreate() {
    setSelected(null);
    setEditorOpen(true);
  }

  function openEdit(note: Note) {
    setSelected(note);
    setEditorOpen(true);
  }

  async function handleSave(input: { title: string; content: string; id?: string }) {
    setError(null);
    // Optimistic update
    if (input.id) {
      // update
      setNotes((prev) =>
        prev.map((n) => (n.id === input.id ? { ...n, ...input, updatedAt: new Date().toISOString() } as Note : n))
      );
      try {
        const updated = await api.updateNote(input.id, {
          title: input.title,
          content: input.content,
        });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to update note";
        setError(message);
        // refresh from source
        const list = await api.listNotes();
        setNotes(list);
      }
    } else {
      // create
      const tempId = `temp-${Date.now()}`;
      const optimistic: Note = {
        id: tempId,
        title: input.title,
        content: input.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [optimistic, ...prev]);
      try {
        const created = await api.createNote({ title: input.title, content: input.content });
        setNotes((prev) => [created, ...prev.filter((n) => n.id !== tempId)]);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to create note";
        setError(message);
        setNotes((prev) => prev.filter((n) => n.id !== tempId));
      }
    }
    setEditorOpen(false);
  }

  async function handleDelete(id: string) {
    setError(null);
    const prev = notes;
    setNotes((curr) => curr.filter((n) => n.id !== id));
    try {
      await api.deleteNote(id);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to delete note";
      setError(message);
      setNotes(prev);
    }
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      {/* Header */}
      <header className="ocean-header">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="ocean-title">Ocean Notes</h1>
            <p className="ocean-subtle">Your ideas, neatly organized</p>
          </div>
          <div className="flex items-center gap-2">
            {apiHealthy === false && (
              <span className="ocean-badge" title="Using local storage fallback">
                Offline mode
              </span>
            )}
            {apiHealthy && <span className="ocean-badge">API Connected</span>}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-6 px-4 py-6">
        <aside className="md:sticky md:top-[84px] h-fit">
          <Sidebar
            value={search}
            onChange={setSearch}
            onCreate={openCreate}
            loading={loading}
          />
        </aside>
        <section>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <NotesGrid
            notes={filtered}
            loading={loading}
            onSelect={openEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {/* Floating Action Button */}
      <button aria-label="Add note" className="ocean-fab" onClick={openCreate}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Editor Modal/Drawer */}
      <NoteEditor
        open={isEditorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        note={selected || undefined}
      />
    </div>
  );
}
