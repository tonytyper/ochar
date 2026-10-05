import { useSyncExternalStore } from "react";
import { MAX_QUANTITY } from "@/lib/site";

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
  add(slug: string, quantity = 1) {
    const lines = read();
    const existing = lines.find((line) => line.slug === slug);
    if (existing) {
      cart.setQuantity(slug, existing.quantity + quantity);
    } else {
      write([...lines, { slug, quantity: Math.min(quantity, MAX_QUANTITY) }]);
    }
  },

  setQuantity(slug: string, quantity: number) {
    if (quantity < 1) {
      cart.remove(slug);
      return;
    }
    write(
      read().map((line) =>
        line.slug === slug
          ? { ...line, quantity: Math.min(quantity, MAX_QUANTITY) }
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
