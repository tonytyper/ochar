import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/app/components/contactform";
import PageHeader from "@/app/components/pageheader";
import { contactTopics, site } from "@/lib/site";
import { canSave } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about an order, a bar, gifts or wholesale. Write to the Tonoyan family behind ochar.",
};

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-6">
      <h2 className="font-serif text-[0.78rem] uppercase tracking-[0.16em] text-muted">
        {title}
      </h2>
      <div className="mt-3 text-ink-soft">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Write to us.">
        <p>
          About an order, a bar, or anything else. We read every message
          ourselves and usually reply within a couple of days.
        </p>
      </PageHeader>

      <section className="wrap grid gap-14 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <div className="space-y-8 lg:col-span-4">
          <Detail title="Email">
            <a
              href={`mailto:${site.email}`}
              className="link break-all font-display text-[1.6rem] leading-tight text-ink"
            >
              {site.email}
            </a>
          </Detail>
          {site.location && (
            <Detail title="Where we are">
              <p>{site.location}</p>
            </Detail>
          )}
          {site.instagram && (
            <Detail title="Instagram">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-ink"
              >
                Follow along as batches come off the rack
              </a>
            </Detail>
          )}
          <Detail title="Gifts and wholesale">
            <p>
              Planning a wedding, stocking a shop shelf or buying for a crowd?
              Tell us how many bars and when you need them. Bigger orders need
              some notice, because of the cure.
            </p>
          </Detail>
          <Detail title="Before you write">
            <p>
              Questions about shipping or ingredients may already be answered
              in the{" "}
              <Link href="/faq" className="link text-ink">
                FAQ
              </Link>
              .
            </p>
          </Detail>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border border-line bg-surface p-7 sm:p-10 lg:p-12">
            {canSave() ? (
              <ContactForm topics={contactTopics} />
            ) : (
              <div className="flex flex-col items-start">
                <p className="font-display text-[2rem] leading-tight">
                  The quickest way to reach us is by email.
                </p>
                <p className="mt-4 text-ink-soft">
                  Tell us what you’re after and we’ll get back to you.
                </p>
                <a href={`mailto:${site.email}`} className="btn btn-primary mt-8">
                  Email us
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
