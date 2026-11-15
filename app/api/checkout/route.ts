import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getProducts } from "@/lib/products";
import { MAX_QUANTITY, shippingCost, site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type AllowedCountry =
  Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry;

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

// the stripe coupon for the bulk discount, made the first time it's needed
// (separately in test and live mode). its id carries the terms, so changing
// site.discount makes a new one
async function discountCoupon(stripe: Stripe) {
  const { minBars, percent } = site.discount;
  const id = `ochar-${percent}-off-${minBars}-bars`;
  try {
    return (await stripe.coupons.retrieve(id)).id;
  } catch (error) {
    if ((error as { code?: string }).code !== "resource_missing") throw error;
  }
  try {
    await stripe.coupons.create({
      id,
      percent_off: percent,
      duration: "once",
      name: `${percent}% off ${minBars}+ bars`,
    });
  } catch (error) {
    // made by another checkout at the same moment
    if ((error as { code?: string }).code !== "resource_already_exists") throw error;
  }
  return id;
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

  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : request.nextUrl.origin;

  // stripe only shows photos from a full https url
  const imageUrl = (image: string | null) => {
    if (!image) return undefined;
    const url = image.startsWith("/") ? origin + image : image;
    return url.startsWith("https://") ? [url] : undefined;
  };

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

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
      return fail(
        product.status === "curing"
          ? `${product.name} is still curing. Remove it to check out.`
          : `${product.name} has sold out. Remove it to check out.`,
        409,
      );
    }
    if (product.quantity !== null && quantity > product.quantity) {
      return fail(`Only ${product.quantity} ${product.name} left.`, 409);
    }

    const unitAmount = Math.round(product.price * 100);
    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency,
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          description: product.summary || undefined,
          images: imageUrl(product.image),
          metadata: { slug: product.slug },
        },
      },
    });
  }

  const { shipping } = site;
  const bars = lineItems.reduce((sum, line) => sum + (line.quantity ?? 0), 0);
  const shippingAmount = Math.round(shippingCost(bars) * 100);

  let coupon: string | undefined;
  if (bars >= site.discount.minBars) {
    try {
      coupon = await discountCoupon(stripe);
    } catch (error) {
      console.error("stripe coupon failed:", error);
      return fail("We couldn’t open the payment page. Please try again.", 502);
    }
  }

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
            display_name: "USPS Ground Advantage",
            fixed_amount: {
              amount: shippingAmount,
              currency: site.currency,
            },
            delivery_estimate: {
              minimum: { unit: "business_day", value: shipping.transitDays.min },
              maximum: { unit: "business_day", value: shipping.transitDays.max },
            },
          },
        },
      ],
      // applies to the soap only, not shipping
      discounts: coupon ? [{ coupon }] : undefined,
      // turn on once stripe tax is set up in the dashboard
      // automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout failed:", error);
    return fail("We couldn’t open the payment page. Please try again.", 502);
  }
}
