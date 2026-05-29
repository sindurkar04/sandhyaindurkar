"use client";

import {
  GANITA_GUIDE_EXAMPLES,
  matchPostsForProblem,
  type GanitaGuideMatch,
} from "@/lib/ganita-guide-match";
import { FormEvent, useState } from "react";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "bot"; kind: "welcome" | "results" | "empty"; matches?: GanitaGuideMatch[] };

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "bot",
  kind: "welcome",
};

function BotAvatar() {
  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[#f5f1eb]">
      <img
        alt=""
        aria-hidden="true"
        className="h-14 w-9 object-cover object-top"
        src="/ganita_logo.png"
      />
    </div>
  );
}

export default function GanitaGuide() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const matches = matchPostsForProblem(trimmed);
    const botMessage: ChatMessage =
      matches.length > 0
        ? {
            id: `bot-${Date.now()}`,
            role: "bot",
            kind: "results",
            matches,
          }
        : {
            id: `bot-${Date.now()}`,
            role: "bot",
            kind: "empty",
          };

    setMessages((current) => [...current, userMessage, botMessage]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="space-y-6">
      <div
        aria-label="Ganita conversation"
        aria-live="polite"
        className="max-h-[28rem] space-y-4 overflow-y-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:p-5"
        role="log"
      >
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div className="flex justify-end" key={message.id}>
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-black px-4 py-3 text-sm leading-relaxed text-white">
                  {message.text}
                </p>
              </div>
            );
          }

          if (message.kind === "welcome") {
            return (
              <div className="flex gap-3" key={message.id}>
                <BotAvatar />
                <div className="space-y-2 rounded-2xl rounded-tl-md border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed text-[color:var(--foreground)]">
                  <p>
                    Hi, I&apos;m Ganita. Describe a decision or data problem in plain
                    language and I&apos;ll point you to the best posts here.
                  </p>
                  <p className="text-[color:var(--muted)]">
                    Example: &ldquo;We ran twenty A/B tests and three won. Should we ship
                    them?&rdquo;
                  </p>
                </div>
              </div>
            );
          }

          if (message.kind === "empty") {
            return (
              <div className="flex gap-3" key={message.id}>
                <BotAvatar />
                <div className="space-y-2 rounded-2xl rounded-tl-md border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed text-[color:var(--foreground)]">
                  <p>
                    I couldn&apos;t match that to a specific post yet. Try naming the metric,
                    experiment, or bias you are worried about.
                  </p>
                  <p className="text-[color:var(--muted)]">
                    Or browse the sections below: Summarize the data, Experiments, or Traps.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="flex gap-3" key={message.id}>
              <BotAvatar />
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm font-bold text-[color:var(--foreground)]">
                  Here are the posts that fit best:
                </p>
                <ul className="space-y-3">
                  {message.matches?.map(({ post, reason }) => (
                    <li key={post.slug}>
                      <a
                        className="block rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 transition hover:border-[color:var(--border-strong)] hover:shadow-sm"
                        href={post.href}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                          {reason}
                        </p>
                        <p className="mt-1 text-base font-bold leading-snug text-[color:var(--foreground)]">
                          {post.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                          {post.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {GANITA_GUIDE_EXAMPLES.map((example) => (
          <button
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-sm text-[color:var(--foreground)] transition hover:border-[color:var(--border-strong)] hover:bg-white"
            key={example}
            onClick={() => ask(example)}
            type="button"
          >
            {example}
          </button>
        ))}
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="ganita-input">
          Describe your data or decision problem
        </label>
        <input
          className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)]"
          id="ganita-input"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe your problem..."
          type="text"
          value={input}
        />
        <button
          className="rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={input.trim().length === 0}
          type="submit"
        >
          Ask Ganita
        </button>
      </form>
    </div>
  );
}
