import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "The terms that apply when you buy from ochar.",
};

export default function TermsPage() {
  const { email, legalName } = site;

  return (
    <>
      <PageHeader title="Terms of sale">
        <p>Last updated {site.policiesUpdated}.</p>
      </PageHeader>

      <div className="wrap pb-24 lg:pb-32">
        <div className="prose-ochar border-t border-line pt-4">
          <p>
            These terms apply when you buy from this website, which is run by {legalName}
            {site.location ? `, ${site.location}` : ""}. You can reach us at{" "}
            <a href={`mailto:${email}`}>{email}</a>. By placing an order, you agree to them.
          </p>

          <h2>Our soap</h2>
          <p>
            Every bar is made by hand in small batches, so size, colour and scent vary a little
            from bar to bar and from the photos. Weights are approximate.
          </p>
          <p>
            Our soap is for external use only. Ingredients are listed in full on each bar’s page.
            If you have allergies or sensitive skin, read them carefully, try a little on your
            inner arm first, and stop using a bar if it irritates your skin. Our products aren’t
            intended to diagnose, treat, cure or prevent any disease.
          </p>

          <h2>Prices and payment</h2>
          <p>
            Prices are in US dollars. Shipping is shown before you pay, and any sales tax that
            applies is worked out at checkout. Payments are processed securely by Stripe.
          </p>
          <p>
            We take care to get prices right, but mistakes happen. If an item was listed at the
            wrong price, we’ll let you know and give you the choice of paying the right price or
            having a full refund.
          </p>

          <h2>Your order</h2>
          <p>
            Your order is accepted once payment goes through and you’ve received your receipt. We
            may cancel an order and refund it in full if a bar is no longer available, if there was
            an error in its price or description, or if we suspect fraud.
          </p>

          <h2>Shipping, returns and refunds</h2>
          <p>
            These are covered on our <Link href="/shipping-returns">shipping and returns</Link>{" "}
            page, which forms part of these terms.
          </p>

          <h2>Liability</h2>
          <p>
            As far as the law allows, our responsibility for any order is limited to the amount
            you paid for it. Nothing here takes away any rights you have under consumer protection
            law.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the United States and of the state where{" "}
            {legalName} is registered.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The version on this page when you place
            an order is the one that applies to it.
          </p>
        </div>
      </div>
    </>
  );
}
