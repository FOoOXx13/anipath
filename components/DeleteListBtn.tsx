"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"


interface DeleteListBtn {
  listId: string;
}

const DeleteListBtn = ({listId}: DeleteListBtn) => {
  const router = useRouter()
  const [isPending,startTransition] = useTransition();

  const handleDelete = () => {
    if(!confirm("Delete this list?")) return;

    startTransition(async() => {
      const res = await fetch(`/api/lists/${listId}`, {
        method:"DELETE",
         credentials: "include",  
      });

      if(!res.ok) {
        alert("Failed to delete list");
        return;
      }

      router.push("/lists")
      router.refresh();
    })
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete List"}
      </button>
    </div>
  )
}

export default DeleteListBtn
