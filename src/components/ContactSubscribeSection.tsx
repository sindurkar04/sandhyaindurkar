"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

function StatusMessage({ status, message }: { status: FormStatus; message: string }) {
  if (status === "idle" || status === "submitting") return null;

  const className =
    status === "success"
      ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
      : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]";

  return (
    <p className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${className}`} role="status">
      {message}
    </p>
  );
}

export default function ContactSubscribeSection() {
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [contactMessage, setContactMessage] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<FormStatus>("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactStatus("submitting");
    setContactMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setContactStatus("error");
        setContactMessage(payload.error ?? "Something went wrong. Please try again.");
        return;
      }

      setContactStatus("success");
      setContactMessage("Message sent. I will get back to you soon.");
      form.reset();
    } catch {
      setContactStatus("error");
      setContactMessage("Could not send your message. Please try again.");
    }
  }

  async function handleSubscribeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribeStatus("submitting");
    setSubscribeMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubscribeStatus("error");
        setSubscribeMessage(payload.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubscribeStatus("success");
      setSubscribeMessage("You are subscribed. Check your inbox for a confirmation note.");
      form.reset();
    } catch {
      setSubscribeStatus("error");
      setSubscribeMessage("Could not subscribe right now. Please try again.");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--border-strong)]";

  return (
    <section className="space-y-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-7">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)] sm:text-3xl">
          Stay in touch
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)]">
          Send a note or subscribe for new articles. You will get updates when something new is
          published.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-[color:var(--border)] bg-[#fafafa] p-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[color:var(--foreground)]">Contact</h3>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Questions, feedback, or collaboration ideas. Messages go to{" "}
              <a className="font-bold text-[color:var(--foreground)] underline" href="mailto:sandhya.indurkar@gmail.com">
                sandhya.indurkar@gmail.com
              </a>
              .
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />

            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="contact-name">
                Name (optional)
              </label>
              <input className={inputClass} id="contact-name" maxLength={120} name="name" type="text" />
            </div>

            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="contact-email">
                Email
              </label>
              <input
                autoComplete="email"
                className={inputClass}
                id="contact-email"
                name="email"
                required
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="contact-message">
                Message
              </label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                id="contact-message"
                maxLength={4000}
                name="message"
                required
                rows={5}
              />
            </div>

            <button
              className="inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={contactStatus === "submitting"}
              type="submit"
            >
              {contactStatus === "submitting" ? "Sending..." : "Send message"}
            </button>

            <StatusMessage message={contactMessage} status={contactStatus} />
          </form>
        </div>

        <div className="space-y-4 rounded-xl border border-[color:var(--border)] bg-[#fafafa] p-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[color:var(--foreground)]">Subscribe</h3>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Get an email when I publish a new article on math, data, or learning through food.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubscribeSubmit}>
            <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />

            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="subscribe-email">
                Email
              </label>
              <input
                autoComplete="email"
                className={inputClass}
                id="subscribe-email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>

            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              One email when something new goes live. Unsubscribe anytime by replying to any update.
            </p>

            <button
              className="inline-flex items-center rounded-lg border border-[color:var(--border-strong)] bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={subscribeStatus === "submitting"}
              type="submit"
            >
              {subscribeStatus === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>

            <StatusMessage message={subscribeMessage} status={subscribeStatus} />
          </form>
        </div>
      </div>
    </section>
  );
}
