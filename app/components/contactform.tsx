"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/contact/actions";
import { Rule } from "./ornament";

const initialState: ContactState = { status: "idle" };

const input =
  "mt-2 block w-full border border-line-strong bg-background px-4 py-3 text-[1.1rem] transition-colors placeholder:text-muted/70 hover:border-muted focus:border-primary focus-visible:outline-1 focus-visible:outline-offset-0";

const label = "text-[0.78rem] uppercase tracking-[0.16em] text-muted";

export default function ContactForm({ topics }: { topics: string[] }) {
  const [state, formAction, pending] = useActionState(
    sendMessage,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <p className="font-display text-[2.2rem] leading-tight">
          Thank you. It’s with us.
        </p>
        <Rule className="mt-6 w-28 text-accent" />
        <p className="mt-6 max-w-sm text-ink-soft">
          We read every message ourselves and will reply to you by email,
          usually within a couple of days.
        </p>
      </div>
    );
  }

  const fields = state.fields ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input
            name="name"
            required
            autoComplete="name"
            defaultValue={fields.name}
            className={input}
          />
        </label>
        <label className="block">
          <span className={label}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={fields.email}
            className={input}
          />
        </label>
      </div>

      <label className="block">
        <span className={label}>What’s it about?</span>
        {/* react only reads a select's default once, so remount it to keep
            the chosen topic after an error */}
        <select
          key={fields.topic}
          name="topic"
          defaultValue={fields.topic ?? topics[0]}
          className={`${input} select-chevron pr-10`}
        >
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={label}>Message</span>
        <textarea
          name="message"
          required
          rows={7}
          defaultValue={fields.message}
          className={`${input} resize-y`}
        />
      </label>

      {/* left empty by people, filled in by spam bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-primary">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}
