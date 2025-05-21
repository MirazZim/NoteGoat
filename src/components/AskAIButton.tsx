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
    formattedText = formattedText.replace(/(\d+\.\s+)(.*?)(?=\n\d+\.|$)/gs, (match, num, content) => {
      return `<li>${content.trim()}</li>`;
    });
    
    // Wrap lists in ol tags
    if (formattedText.includes("<li>")) {
      formattedText = formattedText.replace(/(<li>.*?<\/li>)+/gs, "<ol>$&</ol>");
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
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent
        className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
        ref={contentRef}
      >
        <DialogHeader>
          <DialogTitle>Ask AI About Your Notes</DialogTitle>
          <DialogDescription>
            Our AI can answer questions about all of your notes
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-6">
          {questions.map((question, index) => (
            <Fragment key={index}>
              {/* User question - styled with blue background and right alignment */}
              <div className="flex justify-end">
                <div className="bg-blue-100 text-gray-800 max-w-[70%] rounded-lg px-4 py-2 shadow-sm">
                  {question}
                </div>
              </div>
              
              {/* AI response - styled with light gray background and left alignment */}
              {responses[index] && (
                <div className="flex">
                  <div className="bg-gray-100 text-gray-800 max-w-[70%] rounded-lg px-4 py-3 shadow-sm">
                    <div 
                      className="bot-response prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                    />
                  </div>
                </div>
              )}
            </Fragment>
          ))}
          
          {isPending && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm">
              <Spinner /> <span className="text-gray-600">Thinking...</span>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 p-2 bg-red-50 rounded-md">
              Error: {error}
            </div>
          )}
        </div>

        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              minHeight: "0",
              lineHeight: "normal",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button
            className="ml-auto size-8 rounded-full"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? <Spinner /> : <ArrowUpIcon className="text-background" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskAIButton;