import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping and returns",
  description: "How and when ochar orders ship, what it costs, and what to do if something goes wrong.",
};

export default function ShippingReturnsPage() {
  const { shipping, email } = site;
  const usOnly = shipping.countries.length === 1 && shipping.countries[0] === "US";

  return (
    <>
      <PageHeader eyebrow="Help" title="Shipping and returns">
        <p>The short version: packed by hand, sent quickly, and put right if anything goes wrong.</p>
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
            Shipping is a flat {formatPrice(shipping.flatRate)} per order
            {shipping.freeOver ? `, and free on orders over ${formatPrice(shipping.freeOver)}` : ""}.
            You’ll always see the exact cost before you pay.
          </p>

          <h2>Where we ship</h2>
          <p>
            {usOnly
              ? "For now we only ship within the United States."
              : "We ship to the countries offered at checkout."}
          </p>

          <h2>Damaged, missing or wrong items</h2>
          <p>
            If something arrives damaged or isn’t what you ordered, email us at{" "}
            <a href={`mailto:${email}`}>{email}</a> within {shipping.claimDays} days of delivery,
            with your name and a photo. We’ll send a replacement or refund you in full, whichever
            you prefer.
          </p>

          <h2>Returns</h2>
          <p>
            Soap is a personal care product, so we can’t take back bars that have been opened or
            used. If you change your mind about an unopened order, write to us within{" "}
            {shipping.returnDays} days of delivery. Once it’s back with us in its original
            box, we’ll refund the cost of the soap. Return postage is yours to cover.
          </p>

          <h2>Lost parcels</h2>
          <p>
            If tracking says your parcel was delivered but it isn’t there, check with neighbours
            and your local post office first. Then let us know, and we’ll help however we can.
          </p>

          <h2>Refunds</h2>
          <p>
            Refunds go back to the card you paid with. Your bank may take 5 to 10 business days
            to show it.
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
