"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { useAuth, useClerk } from "@clerk/nextjs";
import Image from "next/image";

interface ListItem {
  _id: string;
  name: string;
  isDefault: boolean;
  contains: boolean;
}

interface SaveListBtnProps {
  animeId: number;
}

const OFFSET = 6;

export default function SaveListBtn({ animeId }: SaveListBtnProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [newListName, setNewListName] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  //Mount safety 
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock
useEffect(() => {
  if (!open) return;

  const scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;
  const scrollTop = scrollEl.scrollTop;

  scrollEl.style.overflow = "hidden";
  scrollEl.style.height = "100%";

  const preventScroll = (e: Event) => {
    e.preventDefault();
  };

  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });

  return () => {
    scrollEl.style.overflow = "";
    scrollEl.style.height = "";
    scrollEl.scrollTop = scrollTop;

    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
  };
}, [open]);



  //Fetch lists
useEffect(() => {
  if (!open) {
    setReady(false);
    return;
  }

  const load = async () => {
    const res = await fetch(`/api/lists?animeId=${animeId}`);
    const data = await res.json();
    setLists(data);
  };

  load();
}, [open, animeId]);


  // Position calculation (after render) 
useEffect(() => {
  if (!open || !buttonRef.current || !modalRef.current || lists.length === 0) return;

  const btnRect = buttonRef.current.getBoundingClientRect();
  const modalRect = modalRef.current.getBoundingClientRect();

  const spaceBelow = window.innerHeight - btnRect.bottom;
  const spaceAbove = btnRect.top;

  const openUpwards = spaceBelow < modalRect.height && spaceAbove > modalRect.height;

  setPosition({
    left: btnRect.left,
    top: openUpwards
      ? btnRect.top - modalRect.height - OFFSET
      : btnRect.bottom + OFFSET,
  });

  //allow modal to appear
  setReady(true);

}, [open, lists]);


  //Outside click
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  //Toggle modal
  const handleToggle = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setOpen(prev => !prev);
  };

  //Toggle list 
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

  //Create new list
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

    // add to UI instantly
    setLists(prev => [...prev, { ...newList, contains: true }]);

    // clear input
    setNewListName("");
  });
};


  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="text-xl hover:text-primary"
      >
        <Image src="/icons/bookmark_dark.png" alt="save_btn" width={24} height={24}/>
      </button>

      {mounted &&
        open &&
       createPortal(
  <div
    ref={modalRef}
    className={`fixed bg-bg-dark text-white rounded-xl shadow-2xl w-72 p-4 z-50 border border-white/10 transition-opacity duration-150 ${
  ready ? "opacity-100" : "opacity-0"
}`}
    style={{
      top: position?.top ?? -9999,
      left: position?.left ?? -9999,
    }}
  >
    {/* Title */}
    <h2 className="text-lg font-semibold mb-3">Save to…</h2>

    {/* Lists */}
    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
 <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
  {lists.map(list => (
    <button
      key={list._id}
      onClick={() => toggleList(list._id)}
      disabled={isPending}
      className="flex items-center justify-between gap-3 text-sm hover:bg-white/5 px-3 py-2 rounded-lg transition disabled:opacity-50"
    >
      <span className="truncate">{list.name}</span>

      <Image
        src={
          list.contains
            ? "/icons/bookmark_dark_fill.png"
            : "/icons/bookmark_dark.png"
        }
        alt="bookmark"
        width={18}
        height={18}
        className="opacity-90"
      />
    </button>
  ))}
</div>

    </div>

    {/* Divider */}
    <div className="h-px bg-white/10 my-3" />

    {/* Create new list */}
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New list"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createNewList()}
        className="flex-1 px-1 py-2 border border-white/10 bg-black/30 text-white text-sm rounded-lg outline-none focus:border-primary"
      />

      <button
        onClick={createNewList}
        disabled={isPending || !newListName.trim()}
        className="px-1 py-2 bg-primary rounded-lg text-white text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Create
      </button>
    </div>

    {/* Close */}
    <button
      onClick={() => setOpen(false)}
      className="mt-3 text-xs text-gray-400 hover:text-white w-full text-center"
    >
      Close
    </button>
  </div>,
  document.body
)
}

        
    </div>
  );
}
