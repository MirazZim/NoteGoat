// app/page.tsx or app/somepath/page.tsx

import { redirect } from "next/navigation";
import { getUser } from './auth/server';
import { prisma } from '@/db/prisma';
import AskAIButton from '@/components/AskAIButton';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const noteIdParam = searchParams.noteId;
  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || "";

  let note = null;

  if (noteId) {
    note = await prisma.note.findUnique({
      where: { id: noteId, authorId: user.id },
    });
  }

  if (!note) {
    note = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!note) {
      note = await prisma.note.create({
        data: {
          authorId: user.id,
          text: "",
        },
      });
    }
    redirect(`/?noteId=${note.id}`);
  }

  return (
    <div className='flex h-full flex-col items-center gap-4'>
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>
      <NoteTextInput noteId={note.id} startingNoteText={note.text || ""} />
    </div>
  );
}
