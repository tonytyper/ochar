import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getProducts } from "@/lib/products";
import { MAX_QUANTITY, site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type AllowedCountry =
  Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry;

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

// turns the cart into a stripe checkout page and hands back its url. prices
// come from the catalogue here on the server, never from the browser
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return fail("Card payments aren’t switched on yet.", 503);
  }

  const body = await request.json().catch(() => null);
  const lines: unknown = body?.items;
  if (!Array.isArray(lines) || lines.length === 0) {
    return fail("Your cart is empty.");
  }
  if (lines.length > 50) {
    return fail("That’s a few too many different bars for one order.");
  }

  let products;
  try {
    products = await getProducts();
  } catch (error) {
    console.error(error);
    return fail("The shop couldn’t be reached. Please try again.", 502);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const { slug, quantity } = line ?? {};
    if (
      typeof slug !== "string" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      return fail("Something in your cart doesn’t look right.");
    }

    const product = products.find((p) => p.slug === slug);
    if (!product) {
      return fail("One of the bars in your cart is no longer sold.");
    }
    if (!product.in_stock) {
      return fail(`${product.name} has sold out. Remove it to check out.`, 409);
    }

    const unitAmount = Math.round(product.price * 100);
    subtotal += unitAmount * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency,
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          description: product.summary || undefined,
          images: product.image?.startsWith("https://")
            ? [product.image]
            : undefined,
          metadata: { slug: product.slug },
        },
      },
    });
  }

  const { shipping } = site;
  const free = shipping.freeOver > 0 && subtotal >= shipping.freeOver * 100;
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: shipping.countries as AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: free ? "Free shipping" : "Standard shipping",
            fixed_amount: {
              amount: free ? 0 : Math.round(shipping.flatRate * 100),
              currency: site.currency,
            },
            delivery_estimate: {
              minimum: { unit: "business_day", value: shipping.transitDays.min },
              maximum: { unit: "business_day", value: shipping.transitDays.max },
            },
          },
        },
      ],
      // turn on once stripe tax is set up in the dashboard
      // automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout failed:", error);
    return fail("We couldn’t open the payment page. Please try again.", 502);
  }
}
