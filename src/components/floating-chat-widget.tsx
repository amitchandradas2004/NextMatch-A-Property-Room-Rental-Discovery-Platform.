"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import {
  MessageSquare,
  X,
  Trash2,
  Send,
  Loader2,
  ShieldAlert,
  Bot
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import toast from "react-hot-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestedFollowUps?: string[];
  createdAt?: string | Date;
}

export default function FloatingChatWidget() {
  const { data: session, isPending: sessionPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const dragControls = useDragControls();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Don't drag when interacting with input, button, textarea, select, list, scroll, or link elements
    if (
      target.tagName === "INPUT" ||
      target.tagName === "BUTTON" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.closest("button") ||
      target.closest("form") ||
      target.closest("a") ||
      target.closest(".select-text")
    ) {
      return;
    }
    dragControls.start(e);
  };

  // Auto-scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Generate or retrieve conversation ID on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("nextmatch_conversation_id");
      if (!id) {
        id = typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("nextmatch_conversation_id", id);
      }
      setConversationId(id);
    }
  }, []);

  // Fetch chat history from Next.js route proxy
  useEffect(() => {
    if (!session || !conversationId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/ai/chat/${conversationId}`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages(data.history || []);
        }
      } catch (err) {
        // console.error("Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, [session, conversationId]);

  // Mutation to send a message
  const mutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await fetch(`/api/ai/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: messageText,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }
      return response.json();
    },
    onMutate: async (messageText: string) => {
      // Optimistic update of the user's message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: messageText },
      ]);
    },
    onSuccess: (data) => {
      if (data.success) {
        // Append assistant reply
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            suggestedFollowUps: data.suggestedFollowUps || [],
          },
        ]);
      } else {
        toast.error("Failed to generate response.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || mutation.isPending) return;

    const textToSend = inputMessage;
    setInputMessage("");
    mutation.mutate(textToSend);
  };

  const handleSendSuggested = (prompt: string) => {
    if (mutation.isPending) return;
    mutation.mutate(prompt);
  };

  const handleClearConversation = async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/ai/chat/${conversationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessages([]);
        toast.success("Chat history cleared.");
      } else {
        toast.error("Failed to clear chat history.");
      }
    } catch {
      toast.error("An error occurred clearing history.");
    }
  };

  // If user is not logged in, hide widget entirely
  if (sessionPending || !session) return null;

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 select-none">
      {/* 1. FLOATING ACTION BUTTON */}
      <motion.div
        drag={!isMobile}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className={`absolute bottom-6 right-6 pointer-events-auto ${
          isMobile ? "" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="AI Chat Assistant"
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-primary hover:bg-primary-hover text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          {/* Subtle pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping pointer-events-none" />
          <MessageSquare className="h-6 w-6 relative z-10" />
        </button>
      </motion.div>

      {/* 2. CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-0 right-0 sm:absolute sm:bottom-24 sm:right-6 w-full sm:w-[380px] h-dvh sm:h-[500px] sm:max-h-[calc(100vh-120px)] flex flex-col pointer-events-none select-none">
            {/* Mobile Backdrop overlay */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm sm:hidden pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              drag={!isMobile}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onPointerDown={isMobile ? undefined : handlePointerDown}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.35 }}
              className={`relative w-full h-full bg-card-bg border border-card-border border-t-4 border-t-primary sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto ${
                isMobile ? "" : "cursor-grab active:cursor-grabbing"
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-4 py-3.5 border-b border-card-border bg-neutral-bg/60 select-none ${
                isMobile ? "" : "cursor-grab active:cursor-grabbing"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-foreground leading-none">NextMatch Assistant</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">AI Support Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <button
                    onClick={handleClearConversation}
                    title="Clear history"
                    className="p-1.5 rounded-xl border border-transparent hover:border-card-border hover:bg-neutral-bg/60 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Minimize chat"
                    className="p-1.5 rounded-xl border border-transparent hover:border-card-border hover:bg-neutral-bg/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message List Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 select-none">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-foreground">Welcome to NextMatch AI Support</h4>
                      <p className="text-xs text-muted font-bold px-2 leading-relaxed">
                        I can help you search listings, understand how our platform filters work, and answer real estate queries! What can I help with?
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full pt-2">
                      <button
                        onClick={() => handleSendSuggested("Show me apartments available for rent")}
                        className="text-xs font-bold py-2 px-3 border border-card-border bg-neutral-bg hover:bg-card-border rounded-xl text-foreground text-left cursor-pointer transition-colors"
                      >
                        🔍 Show me apartments available for rent
                      </button>
                      <button
                        onClick={() => handleSendSuggested("How do I publish a listing?")}
                        className="text-xs font-bold py-2 px-3 border border-card-border bg-neutral-bg hover:bg-card-border rounded-xl text-foreground text-left cursor-pointer transition-colors"
                      >
                        🏠 How do I publish a listing?
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isLastMsg = idx === messages.length - 1;
                    return (
                      <div key={idx} className="space-y-2">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-sm font-semibold whitespace-pre-wrap ${msg.role === "user"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-neutral-bg border border-card-border text-foreground rounded-tl-none"
                              }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>

                        {/* Renders follow-up pills underneath the last assistant message */}
                        {msg.role === "assistant" && isLastMsg && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%] justify-start select-none">
                            {msg.suggestedFollowUps.map((prompt, promptIdx) => (
                              <button
                                key={promptIdx}
                                onClick={() => handleSendSuggested(prompt)}
                                className="text-[10px] font-extrabold px-3 py-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Loading indicator */}
                {mutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-1.5 bg-neutral-bg border border-card-border px-4 py-3 rounded-2xl rounded-tl-none max-w-[80px] shadow-sm select-none mr-auto">
                      <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-card-border bg-neutral-bg/60 flex gap-2 select-none">
                <input
                  type="text"
                  placeholder="Ask Assistant anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={mutation.isPending}
                  className="flex-1 bg-card-bg border border-card-border rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all placeholder-muted"
                />
                <button
                  type="submit"
                  disabled={mutation.isPending || !inputMessage.trim()}
                  className="bg-primary hover:bg-primary-hover disabled:hover:bg-primary text-white p-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-md shadow-primary/10"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
