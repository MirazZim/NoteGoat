// app/page.tsx or app/somepath/page.tsx

import { redirect } from "next/navigation";
import { getUser } from './auth/server';
import { prisma } from '@/db/prisma';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';
import AskAIButton from "@/components/AskAIButton";


type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user?.id },
  });

  if (!note) {
    redirect("/?noteId=${note.id}");
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
