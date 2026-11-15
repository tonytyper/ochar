import { useSyncExternalStore } from "react";
import type { Product } from "@/lib/products";
import { discountFor, MAX_QUANTITY, shippingCost } from "@/lib/site";

// the cart only remembers which bars and how many. names and prices are
// looked up fresh from the catalogue, so a stale cart can't carry old prices
export interface CartLine {
  slug: string;
  quantity: number;
}

const KEY = "ochar-cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();

// useSyncExternalStore needs the same array back until something changes, so
// the parsed cart is kept alongside the string it came from
let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    return value
      .filter(
        (line): line is CartLine =>
          typeof line?.slug === "string" && Number.isInteger(line?.quantity),
      )
      .map((line) => ({
        slug: line.slug,
        quantity: Math.min(Math.max(line.quantity, 1), MAX_QUANTITY),
      }));
  } catch {
    return EMPTY;
  }
}

function read(): CartLine[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cachedLines;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }
  return cachedLines;
}

function write(lines: CartLine[]) {
  const raw = JSON.stringify(lines);
  cachedRaw = raw;
  cachedLines = lines;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // storage can be full or blocked. the cart still works for this visit
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // another tab changed the cart
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// null on the server and during hydration, when the cart can't be known yet.
// lets the cart page show nothing instead of flashing "your cart is empty"
const unknown = () => null;

export function useCart(): CartLine[] | null {
  return useSyncExternalStore(subscribe, read, unknown);
}

export function useCartCount(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => read().reduce((sum, line) => sum + line.quantity, 0),
    unknown,
  );
}

export const cart = {
  // max is how many of the bar are left, when that's known
  add(slug: string, quantity = 1, max = MAX_QUANTITY) {
    const lines = read();
    const existing = lines.find((line) => line.slug === slug);
    if (existing) {
      cart.setQuantity(slug, existing.quantity + quantity, max);
    } else {
      write([...lines, { slug, quantity: Math.min(quantity, max, MAX_QUANTITY) }]);
    }
  },

  setQuantity(slug: string, quantity: number, max = MAX_QUANTITY) {
    if (quantity < 1) {
      cart.remove(slug);
      return;
    }
    write(
      read().map((line) =>
        line.slug === slug
          ? { ...line, quantity: Math.min(quantity, max, MAX_QUANTITY) }
          : line,
      ),
    );
  },

  remove(slug: string) {
    write(read().filter((line) => line.slug !== slug));
  },

  clear() {
    write(EMPTY);
  },
};

// more in the cart than there are left
export function tooMany(product: Product, quantity: number) {
  return product.quantity !== null && quantity > product.quantity;
}

// the cart priced from the catalogue: what the cart page and drawer show,
// worked out the same way the server does at checkout
export function cartTotals(lines: CartLine[], products: Product[]) {
  // bars that have left the catalogue since they were added are skipped
  const items = lines.flatMap((line) => {
    const product = products.find((p) => p.slug === line.slug);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const bars = items.reduce((sum, { quantity }) => sum + quantity, 0);
  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  const discount = discountFor(bars, subtotal);
  const shipping = shippingCost(bars);
  // bars that can't be bought as the cart stands
  const blocked = items.filter(
    ({ product, quantity }) => !product.in_stock || tooMany(product, quantity),
  );
  return {
    items,
    bars,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    blocked,
  };
}

// sends the cart to /api/checkout and on to stripe's payment page
export async function startCheckout(lines: CartLine[]) {
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
}

// whether the slide-out cart is open. adding a bar opens it
let drawerOpen = false;
const drawerListeners = new Set<() => void>();

function setDrawer(open: boolean) {
  drawerOpen = open;
  drawerListeners.forEach((listener) => listener());
}

export const drawer = {
  open: () => setDrawer(true),
  close: () => setDrawer(false),
};

export function useDrawerOpen() {
  return useSyncExternalStore(
    (listener) => {
      drawerListeners.add(listener);
      return () => drawerListeners.delete(listener);
    },
    () => drawerOpen,
    () => false,
  );
}
