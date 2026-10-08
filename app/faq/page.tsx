import type { Metadata } from "next";
import Link from "next/link";
import Disclosure from "@/app/components/disclosure";
import PageHeader from "@/app/components/pageheader";
import { formatPrice, inWords, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Shipping, ingredients, sensitive skin and making a bar last. Answers to the questions we hear most.",
};

const { shipping } = site;
const usOnly = shipping.countries.length === 1 && shipping.countries[0] === "US";

const SECTIONS: { title: string; questions: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Orders and shipping",
    questions: [
      {
        q: "When will my order ship?",
        a: (
          <p>
            We pack every order by hand and send it within{" "}
            {shipping.processingDays}. Once it’s on its way, delivery usually
            takes another {shipping.transitDays.min} to{" "}
            {shipping.transitDays.max} business days.
          </p>
        ),
      },
      {
        q: "How much is shipping?",
        a: (
          <p>
            A flat {formatPrice(shipping.flatRate)} per order
            {shipping.freeOver
              ? `, and free on orders over ${formatPrice(shipping.freeOver)}`
              : ""}
            .
          </p>
        ),
      },
      {
        q: "Do you ship outside the United States?",
        a: usOnly ? (
          <p>
            Not yet, sorry. For now we only ship within the US. If you’d like
            to be told when that changes,{" "}
            <Link href="/contact">drop us a line</Link>.
          </p>
        ) : (
          <p>
            We ship to the countries offered at checkout. If yours isn’t
            listed, <Link href="/contact">ask us</Link>.
          </p>
        ),
      },
      {
        q: "Can I change or cancel my order?",
        a: (
          <p>
            Write to us as soon as you can. If it hasn’t been packed yet, we’re
            happy to change or cancel it.
          </p>
        ),
      },
      {
        q: "My order arrived damaged. What now?",
        a: (
          <p>
            We’re sorry. Email us within {shipping.claimDays} days of delivery
            with a photo, and we’ll send a replacement or a refund. More on our{" "}
            <Link href="/shipping-returns">shipping and returns</Link> page.
          </p>
        ),
      },
    ],
  },
  {
    title: "The soap",
    questions: [
      {
        q: "Is there lye in your soap?",
        a: (
          <p>
            Every true soap is made with lye, but none is left in a finished
            bar. It reacts with the oils during making and becomes soap and
            glycerin. Our <Link href="/ingredients">ingredients page</Link>{" "}
            explains more.
          </p>
        ),
      },
      {
        q: "Why does my bar look a little different from the photo?",
        a: (
          <p>
            Every bar is cut by hand and coloured only with clays, roots and
            petals, so no two batches are identical. Small differences in size
            and shade are part of it.
          </p>
        ),
      },
      {
        q: "Do you use fragrance oils or dyes?",
        a: (
          <p>
            No. Scent comes only from essential oils and absolutes, and colour
            from natural ingredients, or not at all.
          </p>
        ),
      },
      {
        q: "Are your soaps vegan?",
        a: (
          <p>
            Every bar lists its ingredients in full, so you can check before
            you buy. Anything made with honey or animal milk isn’t vegan;
            everything else is.
          </p>
        ),
      },
      {
        q: "Why does it take weeks to make a bar?",
        a: (
          <p>
            After it’s cut, a bar cures for {inWords(site.cureWeeks)} weeks.
            The water evaporates and the soap turns harder and milder. A fully
            cured bar is gentler on skin and lasts much longer in the shower.
          </p>
        ),
      },
    ],
  },
  {
    title: "Care and skin",
    questions: [
      {
        q: "How do I make a bar last?",
        a: (
          <p>
            Keep it dry between uses. A soap dish that drains, out of the
            shower spray, makes more difference than anything else. Cutting a
            bar in half and using one piece at a time helps too.
          </p>
        ),
      },
      {
        q: "Can I use it on my face?",
        a: (
          <p>
            Many people do, especially with our gentler, low-scent bars. If
            your skin is sensitive, try a little on your inner arm first.
          </p>
        ),
      },
      {
        q: "I have sensitive skin or allergies. Which bar should I choose?",
        a: (
          <p>
            Start with an unscented bar, read the ingredients carefully, and
            patch test before using it all over. If you’re unsure,{" "}
            <Link href="/contact">ask us</Link> and we’ll tell you exactly
            what’s in a batch.
          </p>
        ),
      },
    ],
  },
  {
    title: "Gifts and bigger orders",
    questions: [
      {
        q: "Do you do gifts, favours or wholesale?",
        a: (
          <p>
            <Link href="/contact">Get in touch</Link> and tell us what you have
            in mind, how many bars you need and when. Bigger orders need a
            little notice because of the cure.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Questions, answered.">
        <p>
          The things we’re asked most. If yours isn’t here,{" "}
          <Link href="/contact" className="link text-ink">
            write to us
          </Link>
          .
        </p>
      </PageHeader>

      <div className="wrap pb-24 lg:pb-32">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="grid gap-6 border-t border-line-strong py-12 lg:grid-cols-12 lg:gap-8"
          >
            <h2 className="text-[2rem] leading-tight lg:col-span-4">
              {section.title}
            </h2>
            <div className="lg:col-span-8 [&_a]:text-primary [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[0.22em]">
              {section.questions.map((item) => (
                <Disclosure key={item.q} title={item.q}>
                  {item.a}
                </Disclosure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
