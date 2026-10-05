import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

// null until STRIPE_SECRET_KEY is set. built lazily so a build without the
// key doesn't fail
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!client) {
    client = new Stripe(key, { appInfo: { name: "ochar" } });
  }
  return client;
}

export function checkoutEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
