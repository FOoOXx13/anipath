"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import SaveListModal from "./SaveListModal";

interface SaveListBtnProps {
  animeId: number;
  initialSaved: boolean;
}

export default function SaveListBtn({ animeId, initialSaved }: SaveListBtnProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4, // a little space below button
        left: rect.left + window.scrollX,
      });
    }

    setOpen(prev => !prev);
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

      {open && coords && (
        <SaveListModal
          animeId={animeId}
          onClose={() => setOpen(false)}
          coords={coords}
        />
      )}
    </div>
  );
}
