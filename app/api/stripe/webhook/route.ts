import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

// stripe calls this when a checkout is paid. the order is saved to the supabase
// orders table, so there's a record outside of stripe. stripe retries anything
// that doesn't get a 2xx back, and the upsert makes a retry harmless
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      try {
        await saveOrder(stripe, session);
      } catch (error) {
        console.error(`couldn't save order ${session.id}:`, error);
        return NextResponse.json({ error: "Not saved" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function saveOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log(`order ${session.id} paid (no database set up to save it)`);
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  // save_paid_order (supabase/schema.sql) saves the order and lowers the
  // stock in one go, and only the first time stripe sends it
  const { error } = await supabase.rpc("save_paid_order", {
    p_session: session.id,
    p_email: session.customer_details?.email ?? null,
    p_name: session.customer_details?.name ?? null,
    p_shipping: session.collected_information?.shipping_details ?? null,
    p_items: lineItems.data.map((item) => ({
      slug: (item.price?.product as Stripe.Product | undefined)?.metadata?.slug ?? null,
      name: item.description,
      quantity: item.quantity,
      amount: item.amount_total,
    })),
    p_amount: session.amount_total,
    p_currency: session.currency,
  });

  if (error) {
    throw new Error(error.message);
  }
}
