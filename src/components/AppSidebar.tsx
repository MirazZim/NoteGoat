import { getUser } from "@/app/auth/server";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
  } from "@/components/ui/sidebar"
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
  
 async function AppSidebar() {

    // Get the user from the auth server
    const user = await getUser();

    // Start with an empty array of notes
    let notes: Note[] = [];

    // If the user is logged in, fetch all their notes
    if (user) {
        // Use Prisma to query the database
        notes = await prisma.note.findMany({
          // Only find notes where the author ID matches the user's ID
          where: {
            authorId: user.id,
          },
          // Sort the notes by their updated date, newest first
          orderBy: {
            updatedAt: "desc",
          },
        });
      }
    

    return (
        <Sidebar>
        <SidebarContent className="custom-scrollbar">
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 mt-2 text-lg">
              {user ? (
                "Your Notes"
              ) : ( 
                <p>
                  <Link href="/login" className="underline">
                    Login
                  </Link>{" "}
                  to see your notes
                </p>
              )}
            </SidebarGroupLabel>
            {user && <SidebarGroupContent notes={notes} />}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  export default AppSidebar