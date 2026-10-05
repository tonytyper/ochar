"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import Quantity from "./quantity";

export default function AddToCart({
  slug,
  price,
  inStock,
}: {
  slug: string;
  price: number;
  inStock: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!inStock) {
    return (
      <div>
        <button type="button" disabled className="btn btn-quiet w-full">
          Sold out
        </button>
        <p className="mt-3 text-[0.98rem] text-muted">
          Back after the next batch has cured.{" "}
          <Link href="/contact" className="link text-ink-soft">
            Ask us
          </Link>{" "}
          and we’ll let you know when it’s ready.
        </p>
      </div>
    );
  }

  function add() {
    cart.add(slug, quantity);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 5000);
  }

  return (
    <div>
      <div className="flex gap-3">
        <Quantity value={quantity} onChange={setQuantity} label="Quantity" />
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
      <p aria-live="polite" className="mt-3 min-h-[1.6em] text-[0.98rem] text-ink-soft">
        {added && (
          <>
            In your cart.{" "}
            <Link href="/cart" className="link text-primary">
              View cart and check out
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
