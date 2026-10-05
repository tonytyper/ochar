"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { Sprig } from "./ornament";
import ProductImage from "./productart";
import Quantity from "./quantity";

interface Props {
  products: Product[];
  checkoutEnabled: boolean;
  flatRate: number;
  freeOver: number;
  email: string;
}

export default function CartView({
  products,
  checkoutEnabled,
  flatRate,
  freeOver,
  email,
}: Props) {
  const lines = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // the cart isn't known until the browser has read it
  if (lines === null) {
    return <div aria-busy="true" className="min-h-[40vh]" />;
  }

  // bars that have left the catalogue since they were added are skipped
  const items = lines.flatMap((line) => {
    const product = products.find((p) => p.slug === line.slug);
    return product ? [{ product, quantity: line.quantity }] : [];
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center border-t border-line py-20 text-center">
        <Sprig className="h-24 w-10 text-primary/70" />
        <p className="mt-6 font-display text-[2rem]">Your cart is empty.</p>
        <p className="mt-2 text-ink-soft">
          Every bar is in the shop, with exactly what’s in it.
        </p>
        <Link href="/shop" className="btn btn-primary mt-9">
          Browse the soaps
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  const freeShipping = freeOver > 0 && subtotal >= freeOver;
  const shippingCost = freeShipping ? 0 : flatRate;
  const soldOut = items.filter(({ product }) => !product.in_stock);

  async function checkout() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout couldn’t be started.");
      }
      window.location.assign(data.url);
    } catch (problem) {
      setError(
        problem instanceof Error ? problem.message : "Something went wrong.",
      );
      setPending(false);
    }
  }

  // until card payments are switched on, orders can come in by email
  const orderEmail =
    `mailto:${email}?subject=${encodeURIComponent("An order")}&body=` +
    encodeURIComponent(
      "Hello! I'd like to order:\n\n" +
        items
          .map(({ product, quantity }) => `${quantity} x ${product.name}`)
          .join("\n") +
        "\n\nMy shipping address:\n\n",
    );

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <ul className="border-t border-line lg:col-span-7">
        {items.map(({ product, quantity }) => (
          <li
            key={product.slug}
            className="grid grid-cols-[7rem_1fr] gap-5 border-b border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-7"
          >
            <Link
              href={`/shop/${product.slug}`}
              className="relative block aspect-photo self-start overflow-hidden bg-sunken"
              tabIndex={-1}
              aria-hidden="true"
            >
              <ProductImage product={product} sizes="160px" />
            </Link>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <Link
                  href={`/shop/${product.slug}`}
                  className="font-display text-[1.5rem] leading-tight transition-colors hover:text-primary"
                >
                  {product.name}
                </Link>
                <span className="tabular-nums lining-nums">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
              <p className="text-[0.95rem] text-muted">
                {formatPrice(product.price)} each
              </p>
              {!product.in_stock && (
                <p className="mt-2 text-[0.95rem] text-primary">
                  This bar has sold out since you added it.
                </p>
              )}
              <div className="mt-auto flex items-center gap-6 pt-4">
                <Quantity
                  compact
                  value={quantity}
                  onChange={(value) => cart.setQuantity(product.slug, value)}
                  label={`Quantity of ${product.name}`}
                />
                <button
                  type="button"
                  onClick={() => cart.remove(product.slug)}
                  className="link text-[0.95rem] text-muted"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="border border-line bg-surface p-7 lg:sticky lg:top-32">
          <h2 className="text-[1.7rem]">Summary</h2>
          <dl className="mt-6 space-y-3 tabular-nums lining-nums">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd>{freeShipping ? "Free" : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-[1.3rem]">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal + shippingCost)}</dd>
            </div>
          </dl>

          {freeOver > 0 && !freeShipping && (
            <p className="mt-4 text-[0.95rem] text-leaf">
              Add {formatPrice(freeOver - subtotal)} more for free shipping.
            </p>
          )}

          {checkoutEnabled ? (
            <>
              <button
                type="button"
                onClick={checkout}
                disabled={pending || soldOut.length > 0}
                className="btn btn-primary mt-7 w-full"
              >
                {pending ? "One moment" : "Check out"}
              </button>
              {soldOut.length > 0 && (
                <p className="mt-3 text-[0.95rem] text-primary">
                  Remove the sold out bar to check out.
                </p>
              )}
              {error && (
                <p role="alert" className="mt-3 text-[0.95rem] text-primary">
                  {error}
                </p>
              )}
              <p className="mt-4 text-[0.9rem] text-muted">
                Payment is handled securely by Stripe. Any sales tax is added
                at checkout.
              </p>
            </>
          ) : (
            <>
              <a href={orderEmail} className="btn btn-primary mt-7 w-full">
                Order by email
              </a>
              <p className="mt-4 text-[0.95rem] text-ink-soft">
                Card payments open soon. Until then, send us your order and
                we’ll reply with an invoice and a shipping date.
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
