import { getUser } from "@/app/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import { PencilLine, LogIn } from "lucide-react"; // Iconic flair

async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <Sidebar className="bg-white/60 dark:bg-zinc-900/70 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 shadow-md">
      <SidebarContent className="custom-scrollbar px-4 py-6 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-3 mb-4 py-2 rounded-lg shadow">
            <PencilLine className="w-5 h-5 gap-2" />
            {user ? "Your Notes" : "Welcome"}
          </SidebarGroupLabel>

          {user ? (
            <SidebarGroupContent notes={notes} />
          ) : (
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 flex flex-col items-start gap-2">
              <p className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <Link
                  href="/login"
                  className="underline underline-offset-4 text-blue-600 dark:text-blue-400 hover:opacity-80"
                >
                  Log in to access your notes
                </Link>
              </p>
              <p className="italic text-xs text-zinc-500 dark:text-zinc-500">
                Your thoughts belong here ✨
              </p>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
