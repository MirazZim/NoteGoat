"use server"

import { getUser } from "@/app/auth/server";
import { prisma } from "@/db/prisma";
import { buildAIPrompt, formatNotesForAI } from "@/lib/ai";
import { handleError } from "@/lib/utils";


export const createNoteAction = async (noteId: string) => {
    try {
      const user = await getUser();
      if (!user) throw new Error("You must be logged in to create a note");
  
      await prisma.note.create({
        data: {
          id: noteId,
          authorId: user.id,
          text: "",
        },
      });
  
      return { errorMessage: null };
    } catch (error) {
      return handleError(error);
    }
  };




export const updateNoteAction = async (noteId: string, text: string) => {
    try {
        const user = await getUser();
        if (!user) throw new Error("You must be logged in to update a note");
    
        await prisma.note.update({
          where: { id: noteId },
          data: { text },
        });
    
        return { errorMessage: null };
    } catch (error) {
      return handleError(error);
    }
  };


  export const deleteNoteAction = async (noteId: string) => {
    try {
      const user = await getUser();
      if (!user) throw new Error("You must be logged in to delete a note");
  
      await prisma.note.delete({
        where: { id: noteId, authorId: user.id },
      });
  
      return { errorMessage: null };
    } catch (error) {
      return handleError(error);
    }
  };

  export const askAIAboutNotesAction = async (
    newQuestions: string[],
    responses: string[],
  ) => {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to ask AI questions");
  
    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true, createdAt: true, updatedAt: true },
    });
  
    if (notes.length === 0) {
      return "You don't have any notes yet.";
    }
  
    try {
      // Build conversation history
      const conversation = [];
      for (let i = 0; i < newQuestions.length; i++) {
        conversation.push(`[INST] ${newQuestions[i]} [/INST]`);
        if (responses[i]) conversation.push(responses[i]);
      }
  
      const formattedNotes = formatNotesForAI(notes);
      const prompt = buildAIPrompt(formattedNotes, conversation);
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      );
  
      // Check if response is OK before parsing
      if (!response.ok) {
        const text = await response.text(); // Get raw text instead of JSON
        throw new Error(`API request failed: ${text || response.statusText}`);
      }
  
      const data = await response.json();
      let responseText = data[0]?.generated_text || "Could not generate response";
  
      // Basic HTML sanitization
      responseText = responseText
        .replace(/<\/?script>/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
  
      return responseText;
  
    } catch (error) {
      console.error("AI Error:", error);
      return `<p class="text-red-500">Error: ${(error as Error).message}</p>`;
    }
  };