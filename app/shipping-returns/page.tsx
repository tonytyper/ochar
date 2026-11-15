import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import { formatPrice, shippingRates, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping and returns",
  description: "How and when ochar orders ship, what it costs, and what to do if something goes wrong.",
};

export default function ShippingReturnsPage() {
  const { shipping, email } = site;
  const usOnly = shipping.countries.length === 1 && shipping.countries[0] === "US";

  return (
    <>
      <PageHeader title="Shipping and returns">
        <p>
          The short version: packed by hand and sent quickly. All sales are final, but if we
          send you the wrong bar, we’ll fix it.
        </p>
      </PageHeader>

      <div className="wrap pb-24 lg:pb-32">
        <div className="prose-ochar border-t border-line pt-4">
          <h2>When your order ships</h2>
          <p>
            Every order is packed by hand and sent within {shipping.processingDays}. In busy
            weeks, like the run-up to the holidays, it can take a little longer, and we’ll email
            you if there’s a delay. Once it’s on its way, delivery usually takes{" "}
            {shipping.transitDays.min} to {shipping.transitDays.max} business days, and we’ll send
            you a tracking number.
          </p>

          <h2>What it costs</h2>
          <p>
            Orders go by USPS Ground Advantage, with tracking. The cost depends on how many bars
            are in the box:
          </p>
          <table>
            <tbody>
              {shippingRates().map(({ label, price }) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{formatPrice(price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>You’ll always see the exact cost in your cart before you pay.</p>

          <h2>Where we ship</h2>
          <p>
            {usOnly
              ? "For now we only ship within the United States."
              : "We ship to the countries offered at checkout."}
          </p>

          <h2>All sales are final</h2>
          <p>
            Soap is a personal care product. Once a bar has left us, we can’t take it back and
            sell it to someone else, so we don’t accept returns or exchanges, and we can’t refund
            an order because you’ve changed your mind. Please check your order and shipping
            address before you pay.
          </p>

          <h2>If we send the wrong item</h2>
          <p>
            This is the one case we refund. If the bar in your box isn’t the one you ordered,
            email us at <a href={`mailto:${email}`}>{email}</a> within {shipping.claimDays} days
            of delivery, with your name and a photo of what arrived. We’ll send the right bar, or
            refund it if that soap has sold out. You don’t need to send the wrong one back.
          </p>

          <h2>Damaged or lost in the post</h2>
          <p>
            Every bar is boxed and packed with care, but once a parcel is with USPS, it’s out of
            our hands, and we can’t replace or refund parcels that are damaged, delayed or lost
            in the post. If tracking says your parcel was delivered but it isn’t there, check
            with neighbours and your local post office.
          </p>

          <h2>Refunds</h2>
          <p>
            A refund for a wrong item goes back to the card you paid with. Your bank may take 5
            to 10 business days to show it.
          </p>

          <p>
            Anything else? See the <Link href="/faq">FAQ</Link> or{" "}
            <Link href="/contact">get in touch</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
