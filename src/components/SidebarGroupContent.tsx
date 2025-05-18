"use client"

import { Note } from "@prisma/client";


/**
 * Props for the SidebarGroupContent component
 */
type Props = {
  /**
   * A list of notes to be displayed
   */
  notes: Note[];
};

  const SidebarGroupContent = ({ notes }: Props) => {
    console.log(notes)
    return (
      <div>YOur Notes Here</div>
    )
  }

export default SidebarGroupContent