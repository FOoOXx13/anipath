"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { createPortal } from "react-dom";

interface ListItem {
  _id: string;
  name: string;
  isDefault: boolean;
  contains: boolean;
}

interface SaveListModalProps {
  animeId: number;
  onClose: () => void;
  coords: { top: number; left: number };
}

export default function SaveListModal({ animeId, onClose, coords }: SaveListModalProps) {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [newListName, setNewListName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // fetch lists
  useEffect(() => {
    fetch(`/api/lists?animeId=${animeId}`)
      .then(res => res.json())
      .then(setLists);
  }, [animeId]);

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleList = (listId: string) => {
    startTransition(async () => {
      setLists(prev =>
        prev.map(l =>
          l._id === listId ? { ...l, contains: !l.contains } : l
        )
      );

      const res = await fetch("/api/lists/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, animeId }),
      });

      if (!res.ok) {
        setLists(prev =>
          prev.map(l =>
            l._id === listId ? { ...l, contains: !l.contains } : l
          )
        );
      }
    });
  };

  const createNewList = () => {
    if (!newListName.trim()) return;

    startTransition(async () => {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName }),
      });

      if (!res.ok) return;

      const newList = await res.json();
      setLists(prev => [...prev, { ...newList, contains: false }]);
      setNewListName("");
    });
  };

  const modalContent = (
    <div
      ref={modalRef}
      className="absolute bg-bg-dark text-white rounded-xl shadow-lg w-72 p-4 z-[9999]"
      style={{ top: coords.top, left: coords.left }}
    >
      <h2 className="text-lg font-bold mb-3">Save to…</h2>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {lists.map(list => (
          <label key={list._id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={list.contains}
              onChange={() => toggleList(list._id)}
              disabled={isPending}
              className="accent-primary"
            />
            {list.name}
          </label>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="New list"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          className="flex-1 p-1 border border-gray-600 bg-bg-dark text-white text-sm rounded"
        />
        <button
          onClick={createNewList}
          className="px-3 py-1 bg-primary rounded text-white text-sm"
        >
          + Create
        </button>
      </div>

      <button
        onClick={onClose}
        className="mt-3 text-xs text-gray-400 hover:text-white"
      >
        Close
      </button>
    </div>
  );

  return createPortal(modalContent, document.body);
}
