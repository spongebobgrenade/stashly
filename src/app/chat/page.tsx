"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const trimmedInput =
      input.trim();

    if (
      !trimmedInput ||
      loading
    ) {
      return;
    }

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedInput,
      },
    ]);

    setLoading(true);

    const history = messages
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message:
                trimmedInput,
              history,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to get answer"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, I ran into an error: ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              Memory Chat

              <span className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-normal text-zinc-400">
                Beta
              </span>
            </h1>
          </div>

          <div className="font-mono text-xs text-zinc-500">
            Ollama Provider
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 py-6 md:px-6">
        {messages.length ===
        0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-3xl">
              🧠
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">
                Ask your saved memories
              </h2>

              <p className="max-w-md text-sm text-zinc-400">
                Query facts,
                bookmarks,
                notes,
                screenshots,
                links,
                and saved
                knowledge in
                Stashly.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map(
              (message) => {
                const isUser =
                  message.role ===
                  "user";

                return (
                  <div
                    key={
                      message.id
                    }
                    className={`flex ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-tr-none bg-zinc-800 text-zinc-100"
                          : "rounded-tl-none border border-zinc-800 bg-zinc-900 text-zinc-100"
                      }`}
                    >
                      {
                        message.content
                      }
                    </div>
                  </div>
                );
              }
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                  </span>

                  <span>
                    Searching
                    memories...
                  </span>
                </div>
              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-10 border-t border-zinc-800 bg-zinc-900/30 p-4 backdrop-blur-md">
        <form
          onSubmit={
            handleSend
          }
          className="mx-auto flex w-full max-w-3xl items-end gap-3"
        >
          <textarea
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            disabled={
              loading
            }
            rows={1}
            placeholder="Ask anything about your saved items..."
            onKeyDown={(
              e
            ) => {
              if (
                e.key ===
                  "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();

                if (
                  input.trim() &&
                  !loading
                ) {
                  void handleSend(
                    e as unknown as React.FormEvent
                  );
                }
              }
            }}
            className="flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-zinc-700 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={
              !input.trim() ||
              loading
            }
            className="flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition duration-150 hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}