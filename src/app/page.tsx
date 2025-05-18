import React from 'react'
import { getUser } from './auth/server';
import { prisma } from '@/db/prisma';
import AskAIButton from '@/components/AskAIButton';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  // if noteIdParam is an array, use the first element as the noteId
  // this is because the URL parameter could be an array if there are multiple query params with the same name
  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  // find the note with the given id, if it belongs to the current user
  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user?.id },
  });
  return (
    <div className='flex h-full flex-col items-center gap-4'>
      <div className="flex w-full max-w-4xl justify-end gap-2">

      <AskAIButton user={user} />
      {/* <NewNoteButton  /> */}
        
      </div>

      <NoteTextInput />

    </div>
  )
}

export default HomePage