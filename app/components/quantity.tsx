"use client";

import { MAX_QUANTITY } from "@/lib/site";

// a small minus / count / plus control
export default function Quantity({
  value,
  onChange,
  label,
  compact = false,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  compact?: boolean;
}) {
  const button =
    "grid h-full place-items-center text-xl leading-none text-ink-soft transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-stretch border border-line-strong bg-surface ${
        compact ? "h-10" : "h-[3.1rem]"
      }`}
    >
      <button
        type="button"
        aria-label="One fewer"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className={`${button} ${compact ? "w-9" : "w-11"}`}
      >
        &minus;
      </button>
      <output
        aria-live="polite"
        className="grid w-8 place-items-center tabular-nums lining-nums"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label="One more"
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        className={`${button} ${compact ? "w-9" : "w-11"}`}
      >
        +
      </button>
    </div>
  );
}
