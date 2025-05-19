"use client"

/**
 * This hook provides the note text and a function to set the note text.
 * It must be used within a NoteProvider.
 */
import { NoteProviderContext } from "@/providers/NoteProvider";
import { useContext } from "react";

function useNote() {
    /**
     * Gets the context from the NoteProvider.
     * If the context is not found, it throws an error.
     */
    const context = useContext(NoteProviderContext);
    if (!context) {
        throw new Error("useNote must be used within a NoteProvider");
    }

    /**
     * Returns the note text and a function to set the note text.
     */
    return context;
}

export default useNote;
