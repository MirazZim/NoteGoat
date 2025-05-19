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
    className="custom-scrollbar mb-4 h-full max-w-4xl resize-none border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
  />
  )
}

export default NoteTextInput