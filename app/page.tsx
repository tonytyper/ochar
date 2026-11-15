import Link from "next/link";
import HeroSection from "@/app/components/herosection";
import { Hourglass, Leaf, List, Tag } from "@/app/components/icons";
import ProductCard, { GRID } from "@/app/components/productcard";
import ProductImage from "@/app/components/productart";
import { getProducts } from "@/lib/products";
import { formatPrice, inWords, site } from "@/lib/site";

// picks up catalogue changes from supabase without a redeploy
export const revalidate = 300;

const STEPS = [
  {
    title: "Weigh",
    text: "Olive, coconut and shea, measured to the gram. The recipe decides how hard the bar is and how it lathers.",
  },
  {
    title: "Pour",
    text: "The oils meet the lye, then the scent and colour go in, and the swirls are poured by hand into moulds.",
  },
  {
    title: "Cut",
    text: "A day or two later the loaf comes out of the mould and is cut into bars by hand.",
  },
  {
    title: "Cure",
    text: `${inWords(site.cureWeeks, true)} weeks on an open rack, until each bar is hard, mild and long-lasting. Then it’s trimmed and boxed.`,
  },
];

const GOES_IN = [
  "Olive and coconut oil",
  "Shea butter and castor oil",
  "Vitamin E",
  "Skin-safe micas for colour",
  "A scent, named on every label",
];

const STAYS_OUT = ["Palm oil", "Sulfates and detergents", "Parabens"];

export default async function Home() {
  const products = await getProducts();
  const forSale = products
    .filter((product) => product.in_stock)
    .sort((a, b) => Number(!a.image) - Number(!b.image));
  const curing = products.filter((product) => product.status === "curing");
  // three different bars for the discount panel
  const trio = forSale.filter((product) => product.image).slice(0, 3);
  const { minBars, percent } = site.discount;

  const benefits = [
    {
      icon: Hourglass,
      title: `Cured ${inWords(site.cureWeeks)} weeks`,
      text: "Every bar rests on the rack until it’s hard, mild and long-lasting.",
    },
    {
      icon: Leaf,
      title: "Made by hand",
      text: "Poured, cut and boxed by our family, about ten bars at a time.",
    },
    {
      icon: List,
      title: "Every ingredient listed",
      text: "What’s on the label is what’s in the bar, down to the colour.",
    },
    {
      icon: Tag,
      title: `${percent}% off ${inWords(minBars)} or more`,
      text: "Mix any scents you like. It comes off in your cart.",
    },
  ];

  return (
    <>
      <HeroSection products={products} />

      {/* why ochar, in four lines */}
      <section className="border-y border-line bg-surface">
        <ul className="wrap grid grid-cols-2 gap-x-6 gap-y-9 py-10 lg:grid-cols-4 lg:gap-10 lg:py-12">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Icon className="size-8 shrink-0 text-accent" />
              <div>
                <h2 className="font-display text-[1.25rem] leading-tight">{title}</h2>
                <p className="mt-1 text-[0.98rem] leading-snug text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* the shop, right here */}
      <section className="wrap py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-section">Shop the soaps</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              {inWords(forSale.length, true)} bars ready to send, each one
              numbered on its box.
            </p>
          </div>
          <Link href="/shop" className="link text-lg text-ink">
            See all {inWords(products.length)} soaps
          </Link>
        </div>
        <div className={`mt-10 ${GRID}`}>
          {forSale.map((product, i) => (
            <ProductCard key={product.id} product={product} preload={i < 2} />
          ))}
        </div>
      </section>

      {/* the bundle discount */}
      {trio.length === 3 && (
        <section className="bg-sunken">
          <div className="wrap grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
            <div className="lg:col-span-5">
              <h2 className="text-section">
                {inWords(minBars, true)} bars, {percent}% off.
              </h2>
              <p className="mt-5 max-w-md text-[1.2rem] leading-relaxed text-ink-soft">
                Pick any {inWords(minBars)} or more, in any mix of scents, and{" "}
                {percent}% comes off the soap. No code to enter. A bar lasts
                weeks, so it’s an easy way to stock up or share.
              </p>
              <Link href="/shop" className="btn btn-primary mt-9">
                Build your {inWords(minBars)}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:col-span-7 lg:gap-4">
              {trio.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className={`group relative block aspect-[3/4] overflow-hidden bg-background ${
                    i === 1 ? "lg:-translate-y-6" : "lg:translate-y-3"
                  }`}
                >
                  <ProductImage
                    product={product}
                    sizes="(min-width: 1024px) 19vw, 31vw"
                    className="transition-transform duration-[900ms] ease-gentle group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent px-3 pb-2.5 pt-8 font-display text-[1.05rem] text-on-night sm:text-[1.25rem]">
                    {product.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <h2 className="text-section">
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
      <section className="border-t border-line bg-surface">
        <div className="wrap grid gap-14 py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
          <div className="lg:col-span-5">
            <h2 className="text-section">Nothing you’d have to look up.</h2>
            <p className="mt-6 max-w-md text-ink-soft">
              Every bar lists exactly what’s in it, down to the colour. If a word
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
                  <li key={item} className="border-b border-line-strong py-3 text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* coming off the rack */}
      {curing.length > 0 && (
        <section className="border-t border-line">
          <div className="wrap py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-section">Coming soon</h2>
                <p className="mt-3 max-w-xl text-ink-soft">
                  On the curing rack now. Each one is ready to order after its{" "}
                  {inWords(site.cureWeeks)}-week cure.
                </p>
              </div>
              <Link href="/shop#curing" className="link text-lg text-ink">
                See what’s curing
              </Link>
            </div>
            <div className={`mt-10 ${GRID}`}>
              {curing.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* last word */}
      <section className="border-t border-line bg-sunken">
        <div className="wrap flex flex-col items-center py-16 text-center lg:py-20">
          <h2 className="text-section">Small batches, gone quickly.</h2>
          <p className="mt-4 max-w-lg text-[1.15rem] text-ink-soft">
            Each scent is made about ten bars at a time. Shipping starts at{" "}
            {formatPrice(site.shipping.rates[0].price)}, and every order is
            packed by hand.
          </p>
          <Link href="/shop" className="btn btn-primary mt-8">
            Shop what’s in stock
          </Link>
        </div>
      </section>
    </>
  );
}
