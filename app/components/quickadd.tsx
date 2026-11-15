"use client";

import { cart, drawer } from "@/lib/cart";
import { MAX_QUANTITY } from "@/lib/site";

// the add button under a card in the shop: one bar, then the cart opens
export default function QuickAdd({
  slug,
  name,
  left,
}: {
  slug: string;
  name: string;
  left: number | null;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        cart.add(slug, 1, Math.min(left ?? MAX_QUANTITY, MAX_QUANTITY));
        drawer.open();
      }}
      aria-label={`Add ${name} to cart`}
      className="btn btn-quiet min-h-11 w-full px-3 text-[0.74rem] hover:border-primary hover:bg-primary hover:text-parchment-50"
    >
      Add to cart
    </button>
  );
}
