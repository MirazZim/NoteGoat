"use client"
import { Note } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { SidebarMenuButton } from './ui/sidebar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useNote from '@/hooks/useNote';

type Props = {
    note: Note;
  };


const SelectNoteButton = ({ note }: Props) => {
    const noteId = useSearchParams().get("noteId") || "";

  const { noteText: selectedNoteText } = useNote();

  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);

  const [localNoteText, setLocalNoteText] = useState(note.text);

  useEffect(() => {
    if (noteId === note.id) {
      setShouldUseGlobalNoteText(true);
    } else {
      setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseGlobalNoteText) {
      setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseGlobalNoteText]);

  const blankNoteText = "EMPTY NOTE";
   
  let noteText = localNoteText || blankNoteText;
  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }
  return (
    <SidebarMenuButton
  asChild
  className={`
    items-start
    gap-0
    pr-12
    rounded-xl
    px-4
    py-3
    transition
    duration-150
    ease-in-out
    shadow-sm
    border border-transparent
    ${note.id === noteId
      ? "bg-blue-100/60 dark:bg-blue-900/50 border-blue-300 shadow-md"
      : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80"}
  `}
>
  <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col w-full">
    <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap font-medium text-base">
      {noteText}
    </p>
    <p className="text-xs text-zinc-500 dark:text-zinc-400">
      {note.updatedAt.toLocaleDateString()}
    </p>
  </Link>
</SidebarMenuButton>
  )
}

export default SelectNoteButton