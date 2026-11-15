"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import ProductImage from "./productart";

// a bar's photos. side by side and swiped on a phone, stacked on a wide screen
export default function ProductGallery({
  product,
  photos,
}: {
  product: Product;
  photos: string[];
}) {
  const strip = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slides = photos.length ? photos : [null];

  return (
    <div>
      <div
        ref={strip}
        onScroll={(event) => {
          const { scrollLeft, clientWidth } = event.currentTarget;
          setIndex(Math.round(scrollLeft / clientWidth));
        }}
        className="-mx-[clamp(1.25rem,4vw,2.5rem)] flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-4 lg:overflow-visible"
      >
        {slides.map((src, i) => (
          <div
            key={src ?? "label"}
            className="relative aspect-photo w-full shrink-0 snap-center overflow-hidden bg-sunken"
          >
            <ProductImage
              product={product}
              src={src}
              sizes="(min-width: 1024px) 56vw, 100vw"
              preload={i === 0}
              alt={i === 0 ? `${product.name} soap` : `The label on ${product.name}, with its ingredients`}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-2 lg:hidden">
          {slides.map((src, i) => (
            <button
              key={src ?? "label"}
              type="button"
              aria-label={`Photo ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              onClick={() =>
                strip.current?.scrollTo({
                  left: i * strip.current.clientWidth,
                  behavior: "smooth",
                })
              }
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-1 transition-all duration-500 ${
                  i === index ? "w-7 bg-primary" : "w-3 bg-line-strong"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
