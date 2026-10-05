import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import ClearCart from "@/app/components/clearcart";
import { Rule, Sprig } from "@/app/components/ornament";
import { formatPrice, site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

async function getSession(id: string | undefined) {
  const stripe = getStripe();
  if (!stripe || !id?.startsWith("cs_")) {
    return null;
  }
  try {
    return await stripe.checkout.sessions.retrieve(id, {
      expand: ["line_items"],
    });
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const session: Stripe.Checkout.Session | null = await getSession(session_id);
  const complete = session?.status === "complete";
  const firstName = session?.customer_details?.name?.split(" ")[0];
  const email = session?.customer_details?.email;
  const items = session?.line_items?.data ?? [];

  return (
    <section className="wrap flex max-w-3xl flex-col items-center py-20 text-center lg:py-28">
      {complete && <ClearCart />}
      <Sprig className="h-28 w-12 text-primary" />
      <p className="eyebrow mt-8">{complete ? "Order received" : "Checkout"}</p>
      <h1 className="mt-4 text-title">
        {complete
          ? `Thank you${firstName ? `, ${firstName}` : ""}.`
          : "Thank you for stopping by."}
      </h1>

      {complete ? (
        <>
          <p className="mt-6 max-w-xl text-[1.25rem] leading-relaxed text-ink-soft">
            Your order is in. We’ll pack it within{" "}
            {site.shipping.processingDays}
            {email ? `, and your receipt is on its way to ${email}` : ""}.
          </p>

          {items.length > 0 && (
            <div className="mt-12 w-full max-w-md border border-line bg-surface p-7 text-left">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>
                      {item.quantity} &times; {item.description}
                    </span>
                    <span className="tabular-nums lining-nums">
                      {formatPrice(item.amount_total / 100)}
                    </span>
                  </li>
                ))}
              </ul>
              {session?.amount_total != null && (
                <p className="mt-4 flex justify-between border-t border-line pt-4 text-[1.2rem] tabular-nums lining-nums">
                  <span>Total paid</span>
                  <span>{formatPrice(session.amount_total / 100)}</span>
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="mt-6 max-w-xl text-[1.25rem] leading-relaxed text-ink-soft">
          We couldn’t find a finished order here. If you were charged and
          something looks wrong, write to us at{" "}
          <a href={`mailto:${site.email}`} className="link text-ink">
            {site.email}
          </a>
          .
        </p>
      )}

      <Rule className="mt-14 w-32 text-accent" />
      <Link href="/shop" className="btn btn-quiet mt-10">
        Back to the shop
      </Link>
    </section>
  );
}
