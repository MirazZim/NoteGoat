"use client"

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useEffect } from "react";
import { debounceTimeout } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  startingNoteText: string;
};

const NoteTextInput = ({ noteId, startingNoteText }: Props) => {
  // Get the noteId from the URL query param
  const noteIdParam = useSearchParams().get("noteId") || "";

  // Get the noteText and setNoteText from the useNote hook
  const { noteText, setNoteText } = useNote();

  // Set up a variable to store the timeout for debouncing the update action
  let updateTimeout: NodeJS.Timeout;

  // When the component mounts, check if the noteId in the URL matches the noteId prop
  // If it does, set the noteText to the startingNoteText
  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);

  // Handle changes to the note text
  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    // Set the noteText to the new text
    setNoteText(text);

    // Clear any existing timeout
    clearTimeout(updateTimeout);

    // Set a new timeout to update the note with the new text after a short delay
    updateTimeout = setTimeout(() => {
      updateNoteAction(noteId, text);
    }, debounceTimeout);
  };


  return (

    <Textarea
    value={noteText}
    onChange={handleUpdateNote}
    placeholder="Type your notes here.."
    className="
  custom-scrollbar
  mb-4
  h-full
  max-w-4xl
  resize-none
  border
  border-zinc-200
  dark:border-zinc-700
  rounded-2xl
  p-5
  bg-white/60
  dark:bg-zinc-900/70
  shadow-md
  text-base
  font-medium
  placeholder:text-zinc-400
  focus:outline-none
  focus:ring-2
  focus:ring-blue-400
  focus:border-blue-400
  transition
  duration-150
  ease-in-out
"
  />
  )
}

export default NoteTextInput