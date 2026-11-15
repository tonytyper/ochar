"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cart, drawer } from "@/lib/cart";
import { formatPrice, MAX_QUANTITY, type SoapStatus } from "@/lib/site";
import Quantity from "./quantity";

export default function AddToCart({
  slug,
  price,
  inStock,
  status,
  left,
}: {
  slug: string;
  price: number;
  inStock: boolean;
  status: SoapStatus;
  // bars on hand, if known
  left: number | null;
}) {
  const max = Math.min(left ?? MAX_QUANTITY, MAX_QUANTITY);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!inStock) {
    const curing = status === "curing";
    return (
      <div>
        <button type="button" disabled className="btn btn-quiet w-full">
          {curing ? "Curing" : "Sold out"}
        </button>
        <p className="mt-3 text-[0.98rem] text-muted">
          {curing
            ? "On the curing rack now, and not ready to order yet."
            : "Back after the next batch has cured."}{" "}
          <Link href="/contact" className="link text-ink-soft">
            Ask us
          </Link>{" "}
          and we’ll let you know when it’s ready.
        </p>
      </div>
    );
  }

  function add() {
    cart.add(slug, quantity, max);
    drawer.open();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 4000);
  }

  return (
    <div>
      <div className="flex gap-3">
        <Quantity
          value={quantity}
          onChange={setQuantity}
          max={max}
          label="Quantity"
        />
        <button
          type="button"
          onClick={add}
          className="btn btn-primary flex-1 whitespace-nowrap px-5"
        >
          {added ? "Added" : "Add to cart"}
          {/* the running total, where there's room for it */}
          <span className="hidden gap-[inherit] sm:inline-flex">
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span className="tabular-nums lining-nums">
              {formatPrice(price * quantity)}
            </span>
          </span>
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {added ? "Added to your cart." : ""}
      </p>
    </div>
  );
}
