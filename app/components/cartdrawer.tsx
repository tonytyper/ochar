"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  cart,
  cartTotals,
  drawer,
  startCheckout,
  tooMany,
  useCart,
  useDrawerOpen,
} from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatPrice, inWords, MAX_QUANTITY, site } from "@/lib/site";
import DiscountProgress from "./discountprogress";
import { Close } from "./icons";
import ProductImage from "./productart";
import Quantity from "./quantity";

// the cart sliding in from the right, opened by adding a bar or by the cart
// link. a native dialog, so focus stays inside and escape closes it
export default function CartDrawer({
  products,
  checkoutEnabled,
}: {
  products: Product[];
  checkoutEnabled: boolean;
}) {
  const open = useDrawerOpen();
  const lines = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      // focus the panel, not the close button, so no focus ring flashes up
      element.focus();
    }
    if (!open && element.open) element.close();
  }, [open]);

  const totals = lines ? cartTotals(lines, products) : null;

  async function checkout() {
    if (!lines) return;
    setPending(true);
    setError("");
    try {
      await startCheckout(lines);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Your cart"
      tabIndex={-1}
      onClose={drawer.close}
      // a click on the dimmed backdrop lands on the dialog itself
      onClick={(event) => event.target === event.currentTarget && drawer.close()}
      className="paper fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-108 p-0 outline-none text-ink shadow-[-30px_0_60px_-30px_rgb(43_31_27/0.45)] backdrop:bg-night/45 open:animate-[drawer_420ms_var(--ease-gentle)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[1.6rem] leading-none">
            Your cart
            {totals && totals.bars > 0 && (
              <span className="ml-2 font-serif text-[1rem] text-muted tabular-nums lining-nums">
                ({totals.bars})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={drawer.close}
            aria-label="Close cart"
            className="-mr-2 grid size-10 place-items-center text-ink-soft transition-colors hover:text-primary"
          >
            <Close className="size-6" />
          </button>
        </div>

        {totals && totals.items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-[1.8rem]">Your cart is empty.</p>
            <p className="mt-2 text-ink-soft">
              {site.discount.percent}% off when you pick {inWords(site.discount.minBars)} or more.
            </p>
            <Link href="/shop" onClick={drawer.close} className="btn btn-primary mt-8">
              Shop the soaps
            </Link>
          </div>
        )}

        {totals && totals.items.length > 0 && (
          <>
            <div className="border-b border-line px-6 py-4">
              <DiscountProgress bars={totals.bars} />
            </div>

            <ul className="flex-1 overflow-y-auto px-6">
              {totals.items.map(({ product, quantity }) => (
                <li
                  key={product.slug}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-5 last:border-0"
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={drawer.close}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="relative block aspect-photo self-start overflow-hidden bg-sunken"
                  >
                    <ProductImage product={product} sizes="104px" />
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={drawer.close}
                        className="font-display text-[1.3rem] leading-tight transition-colors hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <span className="tabular-nums lining-nums">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                    <p className="text-[0.9rem] text-muted">
                      No. {product.number} · {formatPrice(product.price)} each
                    </p>
                    {!product.in_stock ? (
                      <p className="mt-1 text-[0.9rem] text-primary">
                        {product.status === "curing" ? "Still curing." : "Sold out."}
                      </p>
                    ) : (
                      tooMany(product, quantity) && (
                        <p className="mt-1 text-[0.9rem] text-primary">
                          Only {product.quantity} left.
                        </p>
                      )
                    )}
                    <div className="mt-3 flex items-center gap-5">
                      <Quantity
                        compact
                        value={quantity}
                        onChange={(value) =>
                          cart.setQuantity(
                            product.slug,
                            value,
                            Math.max(product.quantity ?? MAX_QUANTITY, 1),
                          )
                        }
                        max={product.quantity ?? MAX_QUANTITY}
                        label={`Quantity of ${product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => cart.remove(product.slug)}
                        className="link text-[0.9rem] text-muted"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-surface px-6 py-5">
              <dl className="space-y-1.5 tabular-nums lining-nums">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-leaf">
                    <dt>{site.discount.percent}% off</dt>
                    <dd>&minus;{formatPrice(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd>{formatPrice(totals.shipping)}</dd>
                </div>
                <div className="flex justify-between pt-1.5 text-[1.25rem]">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {checkoutEnabled && totals.blocked.length === 0 ? (
                <button
                  type="button"
                  onClick={checkout}
                  disabled={pending}
                  className="btn btn-primary mt-5 w-full"
                >
                  {pending ? "One moment" : "Check out"}
                </button>
              ) : (
                <Link href="/cart" onClick={drawer.close} className="btn btn-primary mt-5 w-full">
                  {totals.blocked.length ? "Review your cart" : "Go to cart"}
                </Link>
              )}
              {error && (
                <p role="alert" className="mt-3 text-[0.95rem] text-primary">
                  {error}
                </p>
              )}
              {checkoutEnabled && totals.blocked.length === 0 && (
                <Link
                  href="/cart"
                  onClick={drawer.close}
                  className="link mt-3 block text-center text-[0.95rem] text-ink-soft"
                >
                  View full cart
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
