"use client"

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNoteAction } from "@/actions/notes";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner'

type Props = {
  user: User | null;
};


const NewNoteButton = ({ user }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login")
      toast.info("Please login to create notes")
    } else {
      try {
        setLoading(true)
        toast.loading("Creating new note...", { id: "create-note" })
  
        const uuid = uuidv4()
        await createNoteAction(uuid)
        
        toast.success("Note created successfully", { id: "create-note" })
        router.push(`/?noteId=${uuid}`)
      } catch {
        toast.error("Failed to create note", { id: "create-note" })
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <Button
  onClick={handleClickNewNoteButton}
  variant="secondary"
  className="
   flex items-center justify-center gap-2
rounded-full
px-5 py-2
font-semibold text-base
shadow-md
transition duration-150 ease-in-out
bg-gradient-to-tr from-blue-500 to-indigo-500
text-white
hover:from-blue-600 hover:to-indigo-600
disabled:opacity-70
  "
  disabled={loading}
>
  {loading ? (
    <Loader2 className="animate-spin w-5 h-5" />
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      New Note
    </>
  )}
</Button>
  )
}

export default NewNoteButton