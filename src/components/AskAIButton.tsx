// components/AskAIButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";
import { ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { askAIAboutNotesAction } from "@/actions/notes";
import { Spinner } from "./Spinner";

type Props = {
  user: User | null;
};

const AskAIButton = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
        setError(null); // Reset error on dialog open
      }
      setOpen(isOpen);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  // Function to format response for better display
  const formatResponse = (text: string): string => {
    // If response already contains HTML, return as is
    if (text.includes("<p>") || text.includes("<div>")) {
      return text;
    }
    // Convert markdown-style formatting to HTML
    // Handle paragraphs
    let formattedText = text.replace(/\n\n/g, "</p><p>");
    // Handle bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Handle lists
    formattedText = formattedText.replace(/(\d+\.\s+)(.*?)(?=\n\d+\.|$)/g, (match, num, content) => {
      return `<li>${content.trim()}</li>`;
    });
    // Wrap lists in ol tags
    if (formattedText.includes("<li>")) {
      formattedText = formattedText.replace(/(<li>.*?<\/li>)+/g, "<ol>$&</ol>");
    }
    // Wrap content in paragraph tags
    if (!formattedText.startsWith("<p>")) {
      formattedText = `<p>${formattedText}</p>`;
    }
    return formattedText;
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    setError(null); // Reset error before submission
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    startTransition(async () => {
      try {
        const response = await askAIAboutNotesAction(newQuestions, responses);
        // Format the response before adding it to the state
        setResponses((prev) => [...prev, formatResponse(response)]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setTimeout(scrollToBottom, 100);
      }
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full px-6 py-2 font-semibold shadow-md bg-gradient-to-tr from-indigo-400 to-blue-400 text-white hover:from-indigo-500 hover:to-blue-500 transition"
        >
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          custom-scrollbar flex h-[85vh] max-w-2xl flex-col
          bg-white/80 dark:bg-zinc-900/70
          backdrop-blur
          rounded-2xl
          border border-zinc-200 dark:border-zinc-800
          shadow-xl
          p-0
          overflow-hidden
        "
      >
        <DialogHeader className="px-8 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70">
          <DialogTitle className="text-xl font-bold">Ask AI About Your Notes</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Our AI can answer questions about all of your notes
          </DialogDescription>
        </DialogHeader>

        {/* Messages */}
        <div
          className="flex-1 px-6 py-6 flex flex-col gap-6 overflow-y-auto"
          ref={contentRef}
        >
          {questions.map((question, index) => (
            <Fragment key={index}>
              {/* User question - chat bubble, right */}
              <div className="flex justify-end">
                <div className="
                  bg-gradient-to-tr from-blue-200 to-blue-100
                  text-zinc-800 dark:text-zinc-800
                  max-w-[70%] rounded-2xl px-5 py-2 shadow
                  
                ">
                  {question}
                </div>
              </div>
              {/* AI response - chat bubble, left */}
              {responses[index] && (
                <div className="flex justify-start">
                  <div className="
                    bg-zinc-100 dark:bg-zinc-800
  text-zinc-900 dark:text-zinc-100
  max-w-[70%] rounded-2xl px-5 py-3 shadow
  text-base
                  ">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                    />
                  </div>
                </div>
              )}
            </Fragment>
          ))}
          {isPending && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500">
              <Spinner /> <span>Thinking...</span>
            </div>
          )}
          {error && (
            <div className="text-red-500 p-2 bg-red-50 rounded-md shadow">
              Error: {error}
            </div>
          )}
        </div>

        {/* Input area - modern, floating, glassy */}
        <div
          className="
            sticky bottom-0 z-10
            bg-white/80 dark:bg-zinc-900/70
            backdrop-blur
            border-t border-zinc-100 dark:border-zinc-800
            px-6 py-4
            flex items-end gap-2
          "
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes…"
            className="
              w-full
              resize-none
              rounded-xl
              bg-zinc-50 dark:bg-zinc-800/60
              border border-zinc-200 dark:border-zinc-700
              px-4 py-2
              text-base
              shadow-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-400
              transition
              placeholder:text-zinc-400
            "
            style={{
              minHeight: "44px",
              lineHeight: "1.5",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button
            className="
              flex items-center justify-center gap-2
rounded-full
px-5 py-2
font-semibold text-base
shadow-md
transition duration-150 ease-in-out
bg-gradient-to-tr from-blue-500 to-indigo-500
text-white
hover:from-blue-600 hover:to-indigo-600
disabled:opacity-70
            "
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? <Spinner /> : <ArrowUpIcon className="w-5 h-5" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskAIButton;
