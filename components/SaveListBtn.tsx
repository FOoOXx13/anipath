"use client";

import {  useState, useTransition } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

interface SaveListBtnProps {
    animeId:number;
    initialSaved:boolean;
}

export default function SaveListBtn({animeId,initialSaved}: SaveListBtnProps) {
    const [saved,setSaved] = useState(initialSaved);
    const [isPending, startTransition] = useTransition();

    const { isSignedIn } = useAuth();
    const { openSignIn } = useClerk();

    const toggleSaved = () => {
    if (!isSignedIn) {
      openSignIn(); 
      return;
    }

    setSaved((prev) => !prev);

    startTransition(async () => {
        const res = await fetch("/api/anime/save", {
            method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId  }),
        });

        if(!res.ok) {
            setSaved((prev) => !prev);
            return;
        }
         const data = await res.json();
        setSaved(data.saved); 
    })
    };

    return (
         <button
      onClick={toggleSaved}
      disabled={isPending}
      className="text-xl"
    >
      {saved ? "🔖" : "📑"}
    </button>
    )



}

