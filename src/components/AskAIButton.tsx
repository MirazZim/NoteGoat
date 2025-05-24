"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon, Sparkles, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/app/styles/ai-response.css";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Array<string | { errorMessage: string }>>([]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!questionText.trim() || isPending) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      try {
        const stringResponses = responses.filter((r): r is string => typeof r === 'string');
        const response = await askAIAboutNotesAction(newQuestions, stringResponses);

        // Handle the response safely
        if (response) {
          setResponses((prev) => [...prev, response]);
        } else {
          // Handle undefined/null response
          setResponses((prev) => [...prev, { errorMessage: "No response received from AI" }]);
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Handle any errors from the action
        setResponses((prev) => [...prev, { errorMessage: "Failed to get AI response. Please try again." }]);
      }
      setTimeout(scrollToBottom, 100);
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

  // const formatAIResponse = (text: string) => {
  //   return text
  //     // Convert **bold** to <strong>
  //     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  //     // Convert ***bold*** to <strong> (triple asterisks)
  //     .replace(/\*\*\*(.*?)\*\*\*/g, '<strong>$1</strong>')
  //     // Add line breaks for better spacing
  //     .replace(/\n/g, '<br>')
  //     // Add spacing after colons (for lists)
  //     .replace(/: \*\*\*/g, ':<br>• <strong>')
  //     .replace(/\*\*\*/g, '</strong>')
  //     // Handle bullet points with ***
  //     .replace(/\*\*\*([^*]+)\*\*: /g, '<br><strong>$1:</strong> ')
  //     // Clean up any remaining asterisks
  //     .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group relative overflow-hidden border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 transition-all duration-300 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50"
        >
          <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] max-w-5xl flex-col border-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-0 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-8 py-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  AI Assistant
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  Ask me anything about your notes and I'll help you find insights
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Chat Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(148 163 184) transparent'
          }}
        >
          {questions.length === 0 && !isPending ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-700">Ready to explore your notes?</h3>
                <p className="text-slate-500 max-w-md">
                  I can help you analyze patterns, summarize content, or answer specific questions about your notes.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "What are the main themes in my notes?",
                  "Summarize my recent notes",
                  "Find notes about specific topics",
                  "What insights can you draw?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestionText(suggestion)}
                    className="p-3 text-left rounded-xl border border-slate-200 bg-white/60 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all duration-200 text-sm text-slate-600 hover:text-slate-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {questions.map((question, index) => (
                <Fragment key={index}>
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="flex max-w-[80%] items-start gap-3">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg">
                        <p className="text-sm leading-relaxed">{question}</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 flex-shrink-0">
                        <UserIcon className="h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  {responses[index] !== undefined && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                          {typeof responses[index] === 'string' ? (
                            <div
                              className="ai-response max-w-none text-slate-700"
                              dangerouslySetInnerHTML={{ __html: responses[index] as string }}
                            />
                          ) : responses[index] && typeof responses[index] === 'object' && 'errorMessage' in responses[index] ? (
                            <p className="text-red-500 text-sm">
                              ⚠️ {(responses[index] as { errorMessage: string }).errorMessage}
                            </p>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No response available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}

              {/* Loading State */}
              {isPending && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-6">
          <div
            className="relative flex items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 focus-within:border-purple-300 focus-within:shadow-md hover:shadow-md cursor-text"
            onClick={handleClickInput}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about your notes..."
              className="flex-1 resize-none border-none bg-transparent p-0 text-slate-700 placeholder:text-slate-400 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[120px]"
              style={{
                minHeight: "24px",
                lineHeight: "1.5",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isPending}
            />
            <Button
              onClick={handleSubmit}
              disabled={!questionText.trim() || isPending}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-0 shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <ArrowUpIcon className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;