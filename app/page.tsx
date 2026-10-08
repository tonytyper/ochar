import Link from "next/link";
import HeroSection from "@/app/components/herosection";
import { Rule, Sprig } from "@/app/components/ornament";
import ProductCard from "@/app/components/productcard";
import { getFeaturedProducts, getProducts } from "@/lib/products";
import { inWords, site } from "@/lib/site";

// picks up catalogue changes from supabase without a redeploy
export const revalidate = 300;

const STEPS = [
  {
    title: "Weigh",
    text: "Olive, coconut and shea, measured to the gram. The recipe decides how hard the bar is and how it lathers.",
  },
  {
    title: "Pour",
    text: "The oils meet the lye, then the milks, clays and botanicals go in, and it all sets in wooden moulds.",
  },
  {
    title: "Cut",
    text: "A day or two later the loaf comes out of the mould and is cut into bars by hand.",
  },
  {
    title: "Cure",
    text: `${inWords(site.cureWeeks, true)} weeks on an open rack, until each bar is hard, mild and long-lasting. Then it’s bevelled and wrapped.`,
  },
];

const GOES_IN = [
  "Olive, coconut and castor oils",
  "Shea and cocoa butter",
  "Oat milk, coconut milk, raw honey",
  "Clays and sea salt",
  "Essential oils and dried botanicals",
];

const STAYS_OUT = [
  "Synthetic fragrance",
  "Palm oil",
  "Sulfates and detergents",
  "Parabens and preservatives",
  "Artificial colour",
];

export default async function Home() {
  const [featured, all] = await Promise.all([
    getFeaturedProducts(3),
    getProducts(),
  ]);

  return (
    <>
      <HeroSection />

      {/* the line of small facts under the hero */}
      <div className="border-y border-line">
        <ul className="wrap grid grid-cols-2 gap-y-3 py-5 text-center text-[0.78rem] uppercase tracking-[0.18em] text-ink-soft md:flex md:items-center md:justify-center md:gap-8">
          {["Small batches", `Cured ${inWords(site.cureWeeks)} weeks`, "Cut by hand", "Wrapped in paper"].map(
            (fact, i) => (
              <li key={fact} className="flex items-center justify-center gap-8">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden size-1.5 rotate-45 bg-accent md:block"
                  />
                )}
                {fact}
              </li>
            ),
          )}
        </ul>
      </div>

      {/* featured bars */}
      <section className="wrap py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The soaps</p>
            <h2 className="mt-3 text-section">Off the curing rack</h2>
          </div>
          <Link href="/shop" className="link text-lg text-ink">
            See all {inWords(all.length)} soaps
          </Link>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* the name */}
      <section className="grain relative overflow-hidden bg-primary text-parchment-50">
        <div className="wrap relative grid items-center gap-12 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-5">
            <p
              lang="hy"
              className="font-armenian text-[clamp(5.5rem,13vw,10rem)] leading-[0.9] text-pomegranate-200"
            >
              օճառ
            </p>
            <p className="mt-6 text-[0.78rem] uppercase tracking-[0.18em] text-pomegranate-100">
              ochar &nbsp;·&nbsp; Armenian for “soap”
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-section">Named for the simplest word we know.</h2>
            <p className="mt-6 text-[1.2rem] leading-relaxed text-pomegranate-50/90">
              We’re the Tonoyans. Ochar is what our family has always called
              soap, and it seemed right to put it on the box. Every bar is
              still made at home by one of us, from the first weigh-in to the
              last fold of the label.
            </p>
            <Link
              href="/about"
              className="btn mt-10 bg-parchment-50 text-primary hover:bg-parchment-200"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* how it's made */}
      <section className="wrap py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="eyebrow">The making</p>
            <h2 className="mt-3 text-section">
              {inWords(site.cureWeeks, true)} weeks from pot to bar.
            </h2>
            <p className="mt-6 max-w-sm text-ink-soft">
              Cold process is the old, slow way of making soap. It keeps the
              good parts of the oils in the bar, and it can’t be hurried.
            </p>
          </div>
          <ol className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-line-strong pt-6">
                <span className="font-display text-[1.9rem] leading-none text-primary">
                  {["i", "ii", "iii", "iv"][i]}.
                </span>
                <h3 className="mt-3 text-[1.7rem] leading-tight">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ingredients */}
      <section className="bg-sunken">
        <div className="wrap grid gap-14 py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
          <div className="lg:col-span-5">
            <p className="eyebrow">Ingredients</p>
            <h2 className="mt-3 text-section">Nothing you’d have to look up.</h2>
            <p className="mt-6 max-w-md text-ink-soft">
              Every bar lists exactly what’s in it, down to the clay. If a word
              on the label is unfamiliar, it’s on our ingredients page with a
              line about why it’s there.
            </p>
            <Link href="/ingredients" className="link mt-8 inline-block text-lg text-ink">
              About our ingredients
            </Link>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <div>
              <h3 className="eyebrow font-serif text-leaf">What goes in</h3>
              <ul className="mt-4 border-t border-line-strong">
                {GOES_IN.map((item) => (
                  <li key={item} className="border-b border-line-strong py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow font-serif text-primary">What stays out</h3>
              <ul className="mt-4 border-t border-line-strong">
                {STAYS_OUT.map((item) => (
                  <li
                    key={item}
                    className="border-b border-line-strong py-3 text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="wrap flex flex-col items-center py-24 text-center lg:py-32">
        <Sprig className="h-28 w-12 text-primary" />
        <h2 className="mt-8 text-section">Small batches, gone quickly.</h2>
        <p className="mt-5 max-w-lg text-[1.2rem] text-ink-soft">
          Each scent is made a few dozen bars at a time. When one sells out,
          it’s back after the next {inWords(site.cureWeeks)}-week cure.
        </p>
        <Rule className="mt-9 w-32 text-accent" />
        <Link href="/shop" className="btn btn-primary mt-9">
          Shop what’s in stock
        </Link>
      </section>
    </>
  );
}
