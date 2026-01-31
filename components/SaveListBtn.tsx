"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { useAuth, useClerk } from "@clerk/nextjs";

interface ListItem {
  _id: string;
  name: string;
  isDefault: boolean;
  contains: boolean;
}

interface SaveListBtnProps {
  animeId: number;
  initialSaved: boolean;
}

export default function SaveListBtn({ animeId, initialSaved }: SaveListBtnProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [modalPos, setModalPos] = useState<{ top: number; left: number } | null>(null);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateModalPos = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  };

  // Fetch lists when modal opens
  useEffect(() => {
    if (open) {
      fetch(`/api/lists?animeId=${animeId}`)
        .then(res => res.json())
        .then(setLists);
      updateModalPos();
    }
  }, [open, animeId]);

  // Handle scroll and click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => updateModalPos();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const handleToggle = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setOpen(prev => !prev);
  };

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

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="text-xl hover:text-primary"
      >
        📂
      </button>

      {mounted &&
        open &&
        modalPos &&
        createPortal(
          <div
            ref={modalRef}
            className="fixed bg-bg-dark text-white rounded-xl shadow-lg w-72 p-4 z-50"
            style={{ top: `${modalPos.top}px`, left: `${modalPos.left}px` }}
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
              onClick={() => setOpen(false)}
              className="mt-3 text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}