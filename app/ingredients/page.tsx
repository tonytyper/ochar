import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import { getProducts, type Product } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "Everything that goes into an ochar bar, and why. Oils, butters, colour and scent, all named on the label.",
};

// each entry shows only if some bar's ingredient list contains `match`. add an
// entry here when a new ingredient joins the catalogue
const GLOSSARY = [
  {
    group: "Oils and butters",
    intro: "Where every bar starts. The mix of oils decides how hard a bar is, and how it lathers.",
    entries: [
      { name: "Olive oil", match: "olive", text: "The base of every bar. Gentle and conditioning, and the reason the lather feels creamy rather than squeaky." },
      { name: "Coconut oil", match: "coconut oil", text: "Gives the big, bubbly lather." },
      { name: "Castor oil", match: "castor", text: "A small amount makes the lather denser and longer-lasting." },
      { name: "Shea butter", match: "shea", text: "Adds hardness and a soft, moisturising feel." },
      { name: "Neem seed oil", match: "neem", text: "Pressed from the seeds of the neem tree, with a strong, earthy character." },
      { name: "Beeswax", match: "bees", text: "A little wax makes a harder bar that lasts longer." },
    ],
  },
  {
    group: "What makes it soap",
    intro: "The few things that turn oils into a bar, and keep it fresh.",
    entries: [
      { name: "Lye", match: "lye", text: "Sodium hydroxide. It reacts with the oils and becomes soap and glycerin, and none is left once the bar has cured." },
      { name: "Water", match: "water", text: "Carries the lye, then evaporates during the cure." },
      { name: "Vitamin E", match: "vitamin e", text: "An antioxidant that helps keep the oils fresh." },
      { name: "Sodium lactate", match: "sodium lactate", text: "A salt made from lactic acid. It gives a harder bar that comes out of the mould cleanly." },
      { name: "Aloe vera juice", match: "aloe", text: "Used in place of some of the water." },
      { name: "Glycerin", match: "glycerin", text: "Draws moisture to the skin." },
      { name: "Sugar", match: "sugar", text: "A pinch boosts the lather." },
    ],
  },
  {
    group: "Colour",
    intro: "All the swirls, stripes and hearts are poured by hand.",
    entries: [
      { name: "Mica", match: "mica", text: "Fine mineral powder in skin-safe colours. Each shade is named on the label, like fruit green or lemon yellow." },
      { name: "Titanium dioxide", match: "titanium", text: "A white mineral pigment, for the brightest white parts of a bar." },
      { name: "Activated charcoal", match: "charcoal", text: "For the deep black swirls." },
    ],
  },
  {
    group: "Scent",
    intro: "Every scent is named on the label. Neem has none at all.",
    entries: [
      { name: "Fragrance", match: "scent", text: "A skin-safe fragrance oil, added at the end of the pour. The name on the box, like Ocean Breeze or Sweet Tobacco, is the scent." },
    ],
  },
];

const LEFT_OUT = [
  ["Palm oil", "Not in any bar, in any form."],
  ["Sulfates and detergents", "Real soap cleans on its own. There’s nothing to add."],
  ["Parabens", "A cured bar of soap doesn’t need them."],
];

function barsWith(products: Product[], match: string) {
  return products.filter((product) =>
    product.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(match),
    ),
  );
}

export default async function IngredientsPage() {
  const products = await getProducts();

  const groups = GLOSSARY.map((group) => ({
    ...group,
    entries: group.entries
      .map((entry) => ({ ...entry, bars: barsWith(products, entry.match) }))
      .filter((entry) => entry.bars.length > 0),
  })).filter((group) => group.entries.length > 0);

  return (
    <>
      <PageHeader eyebrow="Ingredients" title="Everything that goes into a bar.">
        <p>
          Here’s what we use and why. Each bar’s page lists its own
          ingredients in full, so you always know exactly what you’re
          buying.
        </p>
      </PageHeader>

      <section className="wrap pb-20">
        <div className="grid gap-6 border border-line bg-surface p-8 md:grid-cols-12 md:gap-8 md:p-12">
          <h2 className="text-[2rem] leading-tight md:col-span-4">
            A word about lye
          </h2>
          <div className="space-y-4 text-ink-soft md:col-span-8">
            <p>
              All true soap is made with lye (sodium hydroxide). It reacts with
              the oils and turns them into soap and glycerin, and by the time a
              bar has cured there is none left in it.
            </p>
            <p>
              A soap sold as “lye-free” was either made with lye by someone
              else first, or isn’t really soap.
            </p>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.group} className="wrap">
          <div className="grid gap-8 border-t border-line-strong py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
            <div className="lg:col-span-4">
              <h2 className="text-section">{group.group}</h2>
              <p className="mt-4 max-w-xs text-ink-soft">{group.intro}</p>
            </div>
            <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {group.entries.map((entry) => (
                <div key={entry.name}>
                  <dt className="font-display text-[1.45rem] leading-tight">
                    {entry.name}
                  </dt>
                  <dd className="mt-2 text-ink-soft">{entry.text}</dd>
                  <dd className="mt-3 text-[0.95rem] text-muted">
                    In{" "}
                    {entry.bars.map((bar, i) => (
                      <span key={bar.slug}>
                        {i > 0 && (i === entry.bars.length - 1 ? " and " : ", ")}
                        <Link href={`/shop/${bar.slug}`} className="link text-ink-soft">
                          {bar.name}
                        </Link>
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}

      <section className="mt-10 bg-night text-on-night">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
          <div className="lg:col-span-4">
            <h2 className="text-section">What we leave out.</h2>
            <p className="mt-4 max-w-xs text-on-night-muted">
              Just as important as what goes in.
            </p>
          </div>
          <dl className="lg:col-span-7 lg:col-start-6">
            {LEFT_OUT.map(([name, text]) => (
              <div
                key={name}
                className="grid gap-1 border-b border-on-night/15 py-5 first:border-t sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <dt className="font-display text-[1.3rem] text-apricot-200">{name}</dt>
                <dd className="text-on-night-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap py-20 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-[2rem] leading-tight">Sensitive skin or allergies?</h2>
          <p className="mt-4 text-ink-soft">
            Natural isn’t the same as gentle for everyone. Fragrance can irritate skin that
            reacts easily. Neem has no added scent or colour, so it’s the gentlest
            place to start. Try a little on your inner arm first, and{" "}
            <Link href="/contact" className="link text-ink">
              ask us
            </Link>{" "}
            if you’re unsure. Our soaps are for external use only.
          </p>
        </div>
      </section>
    </>
  );
}
