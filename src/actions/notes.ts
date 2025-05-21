"use server"

import { getUser } from "@/app/auth/server";
import { prisma } from "@/db/prisma";
import { buildAIPrompt, formatNotesForAI } from "@/lib/ai";
import { handleError } from "@/lib/utils";
import { CohereClientV2 } from 'cohere-ai';

// Initialize the Cohere client with the API key
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

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
  responses: string[]
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to ask AI questions");

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, text: true, authorId: true, createdAt: true, updatedAt: true },
    });

    if (notes.length === 0) {
      return "You don't have any notes yet.";
    }

    // Build conversation history
    const conversation = [];
    for (let i = 0; i < newQuestions.length; i++) {
      conversation.push(`[INST] ${newQuestions[i]} [/INST]`);
      if (responses[i]) conversation.push(responses[i]);
    }

    // Format notes properly
    const formattedNotes = formatNotesForAI(notes);
    const prompt = buildAIPrompt(formattedNotes, conversation);

    // Call Cohere's API to get the response
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    // Access the generated text
    // (Update this line based on the real structure you get back)
    let responseText =
      response?.message?.content?.[0]?.text ||
      response?.message?.text ||
      response?.text ||
      "Could not generate response";

    // Basic HTML sanitization
    responseText = responseText
      .replace(/<\/?script>/gi, "")
      .replace(/javascript:/gi, "")
      .trim();

    return responseText;
  } catch (error) {
    console.error("AI Error:", error);
    return handleError(error);
  }
};
