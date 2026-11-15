import { inWords, site } from "@/lib/site";

// how close the cart is to the six-bar discount, as a row of six notches
export default function DiscountProgress({ bars }: { bars: number }) {
  const { minBars, percent } = site.discount;
  const left = minBars - bars;

  return (
    <div>
      <p className="text-[0.98rem] text-ink-soft">
        {left > 0 ? (
          <>
            Add {inWords(left)} more {left === 1 ? "bar" : "bars"} for{" "}
            <span className="text-primary">{percent}% off</span> your soap.
          </>
        ) : (
          <span className="text-leaf">
            You’re getting {percent}% off for buying {inWords(minBars)} or more.
          </span>
        )}
      </p>
      <div
        aria-hidden="true"
        className="mt-2.5 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${minBars}, 1fr)` }}
      >
        {Array.from({ length: minBars }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 transition-colors duration-500 ${
              i < bars ? (left > 0 ? "bg-primary" : "bg-leaf") : "bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
