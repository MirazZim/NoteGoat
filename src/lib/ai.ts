// lib/ai.ts
import { Note } from "@prisma/client";

export const formatNotesForAI = (notes: Note[]) => {
  return notes
    .map(
      (note) => `
        <note>
          <text>${note.text}</text>
          <created>${note.createdAt}</created>
          <updated>${note.updatedAt}</updated>
        </note>
      `.trim()
    )
    .join("\n");
};

export const buildAIPrompt = (notes: string, conversation: string[]) => {
  return `
    <system>
    You are a helpful notes assistant. Answer questions based strictly on these notes:
    ${notes}
    
    Rules:
    - Respond in valid HTML
    - Keep answers concise
    - Use bullet points when listing
    - Highlight important dates in <strong>
    - If unsure, say "I don't have information about that"
    </system>
    
    ${conversation.join("\n\n")}
  `.trim();
};