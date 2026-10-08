import type { Metadata } from "next";
import Link from "next/link";
import { Rule, Sprig } from "@/app/components/ornament";
import PageHeader from "@/app/components/pageheader";
import { inWords, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Ochar is the Armenian word for soap. We're the Tonoyans, and we make every bar ourselves.",
};

const VALUES = [
  {
    title: "Short labels",
    text: "Every ingredient is listed on every bar, in plain words. If we wouldn’t want to explain it, it doesn’t go in.",
  },
  {
    title: "Slow soap",
    text: `Cold process and a ${inWords(site.cureWeeks)}-week cure. It takes longer, and it makes a harder, milder bar that lasts.`,
  },
  {
    title: "Made by us",
    text: "Nobody else makes our soap. Every batch is mixed, poured, cut and wrapped by one of the family.",
  },
];

const TIMELINE = [
  {
    when: "Day one",
    title: "Weigh and pour",
    text: "Oils and butters are weighed to the gram, warmed, and brought together with lye. Milks, clays and botanicals go in last, then the batch is poured into wooden moulds and wrapped up warm.",
  },
  {
    when: "Day two",
    title: "Cut",
    text: "The loaf comes out of its mould, firm but still soft enough to slice, and is cut into bars by hand.",
  },
  {
    when: `Weeks one to ${inWords(site.cureWeeks)}`,
    title: "Cure",
    text: "The bars sit on open racks while the water evaporates. They turn harder and milder each week, which is why a cured bar lasts so much longer than a fresh one.",
  },
  {
    when: "After that",
    title: "Bevel and wrap",
    text: "Edges are smoothed, each bar is checked, and it’s wrapped in its label, ready for the shop.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Our story" title={`From ${site.family} to you.`} />

      <section className="wrap grid gap-16 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <div className="space-y-6 text-[1.25rem] leading-relaxed text-ink-soft lg:col-span-7">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.6em] first-letter:leading-[0.78] first-letter:text-primary">
            Ochar started at our kitchen table. We wanted soap with a short
            list of ingredients we could actually pronounce, and the easiest
            way to get it was to make it ourselves.
          </p>
          <p>
            The name came easily. Ochar is the Armenian word for soap, the word
            we grew up with. It’s short and honest, and it says exactly what’s
            in the box.
          </p>
          <p>
            We still make every bar ourselves, in batches small enough to mix
            by hand. Each one cures for {inWords(site.cureWeeks)} weeks before
            it’s ready, and every batch is checked by one of us before it
            reaches the shop.
          </p>
        </div>

        <figure className="flex flex-col items-center self-start border border-line bg-surface px-8 py-12 text-center lg:col-span-4 lg:col-start-9">
          <span
            lang="hy"
            className="font-armenian text-[5.5rem] leading-none text-primary"
          >
            օճառ
          </span>
          <Rule className="mt-6 w-24 text-accent" />
          <figcaption className="mt-5">
            <span className="font-display text-[1.6rem]">ochar</span>
            <span className="mt-1 block text-[0.78rem] uppercase tracking-[0.18em] text-muted">
              Armenian · noun · soap
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="wrap grid gap-12 py-20 md:grid-cols-3 lg:py-24">
          {VALUES.map((value) => (
            <div key={value.title}>
              <Rule className="w-20 text-primary" />
              <h2 className="mt-5 text-[1.9rem] leading-tight">{value.title}</h2>
              <p className="mt-3 text-ink-soft">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow">The making</p>
          <h2 className="mt-3 text-section">How a bar comes to be.</h2>
          <p className="mt-5 text-ink-soft">
            Cold process soap can’t be rushed. Here’s what happens between the
            first weigh-in and the day a bar goes on sale.
          </p>
        </div>

        <ol className="mt-14 border-t border-line-strong">
          {TIMELINE.map((step) => (
            <li
              key={step.title}
              className="grid gap-2 border-b border-line py-8 md:grid-cols-12 md:gap-8"
            >
              <p className="eyebrow pt-2 md:col-span-3">{step.when}</p>
              <h3 className="text-[1.8rem] leading-tight md:col-span-3">
                {step.title}
              </h3>
              <p className="text-ink-soft md:col-span-6">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap flex flex-col items-center pb-24 text-center lg:pb-32">
        <Sprig className="h-24 w-10 text-primary" />
        <h2 className="mt-7 text-section">Come and smell the shelf.</h2>
        <p className="mt-4 max-w-md text-[1.2rem] text-ink-soft">
          Or as close as a website gets. Every bar has its ingredients listed
          in full.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
          <Link href="/shop" className="btn btn-primary">
            Shop the soaps
          </Link>
          <Link href="/contact" className="link text-lg text-ink">
            Say hello
          </Link>
        </div>
      </section>
    </>
  );
}
