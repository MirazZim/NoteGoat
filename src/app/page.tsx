import { getUser } from './auth/server';
import { prisma } from '@/db/prisma';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';
import AskAIButton from "@/components/AskAIButton";
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect('/login');
  }

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  // If no noteId is provided, find the newest note or create one
  if (!noteId) {
    // Try to find the newest note
    const newestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    });

    if (newestNote) {
      // Redirect to the newest note
      redirect(`/?noteId=${newestNote.id}`);
    } else {
      // Create a new note
      const newNote = await prisma.note.create({
        data: {
          authorId: user.id,
          text: "",
        },
      });
      // Redirect to the new note
      redirect(`/?noteId=${newNote.id}`);
    }
  }

  // Fetch the note
  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  // If note doesn't exist or doesn't belong to user, create a new one
  if (!note) {
    const newNote = await prisma.note.create({
      data: {
        authorId: user.id,
        text: "",
      },
    });
    redirect(`/?noteId=${newNote.id}`);
  }

  return (
    <div className='flex h-full flex-col items-center gap-4'>
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>
      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}