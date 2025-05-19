"use client"

import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { deleteNoteAction } from "@/actions/notes";
import { toast } from "sonner";

type Props = {
    noteId: string;
    deleteNoteLocally: (noteId: string) => void;
}

const DeleteNoteButton = ({ noteId, deleteNoteLocally }: Props) => {

  const router = useRouter();
  
  const noteIdParam = useSearchParams().get("noteId") || "";

  const [isPending, startTransition] = useTransition();

  const handleDeleteNote = () => {
    startTransition(async () => {
      // Show loading state immediately
      toast.loading('Deleting note...', { 
        id: 'delete-note',
        duration: Infinity // Prevent auto-dismissal
      });
  
      const { errorMessage } = await deleteNoteAction(noteId);
  
      if (!errorMessage) {
        // Success toast with auto-close
        toast.success('Note deleted successfully', {
          id: 'delete-note',
          description: 'The note has been permanently removed',
          duration: 3000,

        });
  
        deleteNoteLocally(noteId);
        
        if (noteId === noteIdParam) {
          router.replace("/");
        }
      } else {
        // Error toast with longer duration
        toast.error('Failed to delete note', {
          id: 'delete-note',
          description: errorMessage,
          duration: 5000
        });
      }
    });
  };





  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteNote}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteNoteButton