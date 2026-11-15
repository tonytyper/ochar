"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Chevron } from "./icons";

export interface Slide {
  src: string;
  name: string;
  number: number;
  slug: string;
}

const INTERVAL = 5500;

// the box photos at the top of the home page, fading from one to the next.
// pauses while the pointer or focus is on it, and for reduced motion
export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || still || count < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, still, count]);

  if (count === 0) return null;

  const go = (step: number) => setIndex((i) => (i + step + count) % count);
  const slide = slides[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Our soaps"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="relative aspect-photo overflow-hidden bg-sunken">
        {slides.map((item, i) => (
          <Image
            key={item.src}
            src={item.src}
            alt={i === index ? `${item.name} soap, No. ${item.number}` : ""}
            aria-hidden={i !== index}
            fill
            preload={i === 0}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className={`object-cover transition-opacity duration-[1100ms] ease-gentle ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* what's in the picture, linking to it */}
        <Link
          href={`/shop/${slide.slug}`}
          className="absolute bottom-4 left-4 flex items-baseline gap-2 bg-surface/92 px-3.5 py-2 text-ink shadow-[0_8px_20px_-12px_rgb(43_31_27/0.5)] transition-colors hover:text-primary"
        >
          <span className="font-display text-[1.2rem] leading-none">{slide.name}</span>
          <span className="text-[0.8rem] text-muted">No. {slide.number}</span>
          <Chevron className="size-4 self-center" />
        </Link>

        {count > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {[-1, 1].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => go(step)}
                aria-label={step < 0 ? "Previous soap" : "Next soap"}
                className="grid size-10 place-items-center rounded-full bg-surface/92 text-ink shadow-[0_8px_20px_-12px_rgb(43_31_27/0.5)] transition-colors hover:text-primary"
              >
                <Chevron left={step < 0} className="size-5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.name}, No. ${item.number}`}
              aria-current={i === index}
              className="group/dot grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-1 transition-all duration-500 ease-gentle ${
                  i === index ? "w-7 bg-primary" : "w-3 bg-line-strong group-hover/dot:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {paused ? `${slide.name}, No. ${slide.number}` : ""}
      </p>
    </div>
  );
}
