import type { Metadata } from "next";
import PageHeader from "@/app/components/pageheader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What information ochar collects, why, and what we do with it.",
};

export default function PrivacyPage() {
  const { email, legalName } = site;

  return (
    <>
      <PageHeader eyebrow="The small print" title="Privacy">
        <p>Last updated {site.policiesUpdated}.</p>
      </PageHeader>

      <div className="wrap pb-24 lg:pb-32">
        <div className="prose-ochar border-t border-line pt-4">
          <p>
            This page explains what information {legalName} (“we”) collects when you use this
            website, and what we do with it. We keep it to what we need to get soap to you.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>When you order:</strong> your name, email address, shipping and billing
              address, and what you bought. Payment is handled by Stripe. Your card details go
              straight to Stripe and never reach us.
            </li>
            <li>
              <strong>When you write to us:</strong> your name, email address and message.
            </li>
            <li>
              <strong>Your cart:</strong> kept in your own browser, so it’s still there when you
              come back. It doesn’t leave your device until you check out.
            </li>
          </ul>
          <p>
            We don’t use advertising or tracking cookies, and we don’t run analytics on this site.
          </p>

          <h2>How we use it</h2>
          <p>
            To pack and ship your order, send your receipt and any updates about it, answer your
            messages, and keep the records we’re required to for tax and accounting. We don’t sell
            your information, and we won’t send you marketing emails unless you’ve asked for them.
          </p>

          <h2>Who else handles it</h2>
          <p>A few services help us run the shop, and only see what they need to:</p>
          <ul>
            <li>Stripe, which takes payments.</li>
            <li>Supabase, which stores our order records and messages.</li>
            <li>Vercel, which hosts this website and keeps standard server logs.</li>
            <li>The postal carrier, which needs your name and address to deliver your order.</li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            Order records are kept for as long as tax and accounting rules require. Messages are
            kept only as long as they’re useful, and you can ask us to delete yours at any time.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the information we hold about you by emailing{" "}
            <a href={`mailto:${email}`}>{email}</a>. We’ll reply within 30 days. You can empty
            your cart, or clear your browser’s storage, whenever you like.
          </p>

          <h2>Children</h2>
          <p>
            This shop isn’t meant for children under 13, and we don’t knowingly collect their
            information.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, we’ll update this page and the date at the top.
          </p>

          <h2>Questions</h2>
          <p>
            Write to us at <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
