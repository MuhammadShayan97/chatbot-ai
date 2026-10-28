
"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const restaurantRules = rules as Rule[];

const welcomeMessage =
  "👋 Welcome to Desi Bites!\n\nI'm your restaurant assistant in Sargodha. I can help you explore our menu, discover deals, and learn about timings, location, delivery, and payment.\n\nWhat would you like to know today?";

const quickTopics = [
  { label: "Menu", message: "menu", emoji: "🍽️" },
  { label: "Deals", message: "deals", emoji: "🔥" },
  { label: "Timings", message: "timings", emoji: "🕒" },
  { label: "Location", message: "location", emoji: "📍" },
  { label: "Delivery", message: "delivery", emoji: "🛵" },
  { label: "Payment", message: "payment", emoji: "💳" },
];

// Escape special characters so keywords can safely be used in regular expressions.
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match complete words, not partial words.
// For example, "hi" matches "hi there" but not "this".
function findReply(message: string): string {
  const normalizedMessage = message.toLowerCase().trim();

  for (const rule of restaurantRules) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();

      if (!normalizedKeyword) {
        continue;
      }

      const pattern = new RegExp(
        `\\b${escapeRegExp(normalizedKeyword)}\\b`,
        "i"
      );

      if (pattern.test(normalizedMessage)) {
        return rule.reply;
      }
    }
  }

  return "😊 I'm happy to help! I didn't quite understand that question.\n\nTry asking about our menu, deals, timings, location, delivery, payment, or how to order.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: welcomeMessage,
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const nextId = useRef(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const userText = (text ?? input).trim();

    if (!userText || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: nextId.current++,
      sender: "user",
      text: userText,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate the bot thinking before replying.
    window.setTimeout(() => {
      const botMessage: Message = {
        id: nextId.current++,
        sender: "bot",
        text: findReply(userText),
      };

      setMessages((previous) => [...previous, botMessage]);
      setIsTyping(false);
    }, 500);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100d0b] text-white">
      {/* Animated background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-orange-600/15 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] animate-pulse rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Navbar */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 text-2xl shadow-lg shadow-orange-600/20">
              🍛
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                Desi <span className="text-orange-400">Bites</span>
              </h1>
              <p className="text-xs text-stone-400">
                Restaurant Assistant · Sargodha
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs font-medium text-green-300">
              Demo online
            </span>
          </div>
        </header>

        {/* Main content */}
        <section className="grid flex-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          {/* Intro panel */}
          <aside className="flex flex-col justify-center py-2 lg:py-10">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-semibold text-orange-300">
              <span>✨</span>
              YOUR FRIENDLY FOOD ASSISTANT
            </div>

            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Cravings?
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent">
                We&apos;ve got you.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400 sm:text-base">
              Explore delicious desi favourites, check our demo deals, and get
              answers to your restaurant questions — all through one simple
              chatbot.
            </p>

            {/* Food cards */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-400/[0.06] sm:p-4">
                <div className="mb-3 flex h-12 items-center justify-center rounded-xl bg-orange-400/10 text-3xl transition group-hover:scale-110">
                  🍔
                </div>
                <p className="text-center text-xs font-bold sm:text-sm">
                  Burgers
                </p>
                <p className="mt-1 text-center text-[10px] text-stone-500 sm:text-xs">
                  Juicy bites
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-400/[0.06] sm:p-4">
                <div className="mb-3 flex h-12 items-center justify-center rounded-xl bg-orange-400/10 text-3xl transition group-hover:scale-110">
                  🍕
                </div>
                <p className="text-center text-xs font-bold sm:text-sm">
                  Pizza
                </p>
                <p className="mt-1 text-center text-[10px] text-stone-500 sm:text-xs">
                  Cheesy love
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-400/[0.06] sm:p-4">
                <div className="mb-3 flex h-12 items-center justify-center rounded-xl bg-orange-400/10 text-3xl transition group-hover:scale-110">
                  🍛
                </div>
                <p className="text-center text-xs font-bold sm:text-sm">
                  Desi Food
                </p>
                <p className="mt-1 text-center text-[10px] text-stone-500 sm:text-xs">
                  Full of flavour
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs leading-5 text-stone-500">
              <span className="text-lg">⚡</span>
              <p>
                Instant answers. Simple rules. No database or API required.
              </p>
            </div>
          </aside>

          {/* Chatbot */}
          <section className="flex min-h-[580px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#191411]/95 shadow-2xl shadow-black/40 backdrop-blur-xl sm:min-h-[650px]">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-xl shadow-lg shadow-orange-600/20">
                  🤖
                </div>

                <div>
                  <h3 className="font-bold">Desi Bites Bot</h3>
                  <p className="mt-1 text-xs text-stone-400">
                    Ask me anything about our restaurant
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-semibold text-orange-300">
                RULE-BASED
              </div>
            </div>

            {/* Quick topics */}
            <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                Quick questions
              </p>

              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    disabled={isTyping}
                    onClick={() => sendMessage(topic.message)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-stone-300 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                  >
                    <span className="mr-1">{topic.emoji}</span>
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              aria-live="polite"
              aria-label="Chat messages"
              className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2.5 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-400/15 text-sm">
                      🍛
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[85%] ${
                      message.sender === "user"
                        ? "rounded-br-md bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-950/20"
                        : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-stone-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-700 text-sm">
                      👤
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-400/15 text-sm">
                    🍛
                  </div>

                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-4 py-3 text-sm text-stone-400"
                  >
                    <span>Typing</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/[0.08] bg-black/10 p-4 sm:p-5">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Type your message
                </label>

                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about our menu, deals..."
                  autoComplete="off"
                  disabled={isTyping}
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/10 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                >
                  <span>Send</span>
                  <span aria-hidden="true">➤</span>
                </button>
              </form>

              <p className="mt-3 text-center text-[10px] leading-5 text-stone-600">
                Demo chatbot · Replies are based on predefined rules
              </p>
            </div>
          </section>
        </section>

        {/* Footer */}
        <footer className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-white/[0.07] pt-5 text-center text-xs text-stone-600 sm:flex-row sm:text-left">
          <p>© 2026 Desi Bites · Restaurant Chatbot Demo</p>
          <p>Made with Next.js, TypeScript & Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
