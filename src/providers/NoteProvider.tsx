"use client"

import { createContext, useState } from "react";

/**
 * The type of the context that will be shared with the children components.
 * This context will have two properties: noteText and setNoteText.
 * noteText is a string that will contain the text of the note.
 * setNoteText is a function that will update the noteText.
 */
type NoteProviderContextType = {
    noteText: string;
    setNoteText: (text: string) => void;
}

/**
 * The context that will be shared with the children components.
 * This context will contain the noteText and setNoteText.
 */
export const NoteProviderContext = createContext<NoteProviderContextType>({
    noteText: "",
    setNoteText: () => { },
});

/**
 * The NoteProvider component is responsible for providing the context to its children.
 * It will wrap the children with the NoteProviderContext.Provider component.
 * The NoteProviderContext.Provider component will provide the context to its children.
 * The context will contain the noteText and setNoteText.
 */
function NoteProvider({ children }: { children: React.ReactNode }) {
    /**
     * The state of the noteText.
     * This state will be used to store the text of the note.
     */
    const [noteText, setNoteText] = useState("");

    /**
     * The NoteProviderContext.Provider component will provide the context to its children.
     * The context will contain the noteText and setNoteText.
     */
    return (
        <NoteProviderContext.Provider value={{ noteText, setNoteText }}>
            {children}
        </NoteProviderContext.Provider>
    )
}

export default NoteProvider