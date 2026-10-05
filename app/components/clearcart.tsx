"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart";

// empties the cart once an order has gone through
export default function ClearCart() {
  useEffect(() => {
    cart.clear();
  }, []);

  return null;
}
