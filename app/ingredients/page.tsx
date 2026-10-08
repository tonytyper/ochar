import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import { getProducts, type Product } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "Everything that goes into an ochar bar, and why. Plant oils, butters, clays, botanicals and essential oils.",
};

// each entry shows only if some bar's ingredient list contains `match`. add an
// entry here when a new ingredient joins the catalogue
const GLOSSARY = [
  {
    group: "Oils and butters",
    intro: "Where every bar starts. The mix of oils decides how hard a bar is, and how it lathers.",
    entries: [
      { name: "Olive oil", match: "olive", text: "The base of every bar. Gentle and conditioning, and the reason the lather feels creamy rather than squeaky." },
      { name: "Coconut oil", match: "coconut oil", text: "Gives the big, bubbly lather. Used in moderation, since too much can dry the skin." },
      { name: "Castor oil", match: "castor", text: "A small amount makes the lather denser and longer-lasting." },
      { name: "Avocado oil", match: "avocado", text: "Rich and gentle, for a softer, more conditioning bar." },
      { name: "Shea butter", match: "shea", text: "Adds hardness and a soft, moisturising feel." },
      { name: "Cocoa butter", match: "cocoa", text: "A firm butter for a long-lasting bar, with a faint note of chocolate." },
    ],
  },
  {
    group: "Milks and honey",
    intro: "Added at the end of the pour. Their natural sugars make the lather richer.",
    entries: [
      { name: "Oat milk", match: "oat milk", text: "Soothing and mild, and kind to dry skin." },
      { name: "Coconut milk", match: "coconut milk", text: "Adds creaminess and a silky feel to the lather." },
      { name: "Raw honey", match: "honey", text: "Draws moisture to the skin and gives the lather a little extra lift." },
    ],
  },
  {
    group: "Clays, salt and oats",
    intro: "For texture, slip and a little extra cleansing.",
    entries: [
      { name: "Kaolin clay", match: "kaolin", text: "The gentlest clay, in white or blue. Adds slip and a soft, silky finish." },
      { name: "French green clay", match: "green clay", text: "A more absorbent clay, good for oily skin." },
      { name: "Sea salt", match: "sea salt", text: "Makes a hard, mineral bar with a fine, close lather." },
      { name: "Colloidal oatmeal", match: "colloidal", text: "Oats ground to a fine powder, to calm dry or itchy skin." },
    ],
  },
  {
    group: "Botanicals",
    intro: "Dried flowers and roots, for colour and a little texture.",
    entries: [
      { name: "Lavender buds", match: "lavender bud", text: "Whole dried buds, pressed into the top of the bar." },
      { name: "Calendula petals", match: "calendula", text: "Bright marigold petals that keep their colour through the cure." },
      { name: "Orris root", match: "orris", text: "The dried root of the iris, with a soft, powdery scent." },
      { name: "Alkanet root", match: "alkanet", text: "A root that colours a bar naturally, from mauve to deep purple." },
    ],
  },
  {
    group: "Scent",
    intro: "The only fragrance we use comes from plants.",
    entries: [
      { name: "Essential oils", match: "essential oil", text: "Distilled or pressed from leaves, peel, needles and flowers. Each one is named on the bar’s page." },
      { name: "Absolutes", match: "absolute", text: "Some flowers, like jasmine and tuberose, are too delicate to distil, so their scent is drawn out gently instead." },
    ],
  },
];

const LEFT_OUT = [
  ["Synthetic fragrance", "No fragrance oils. Every scent is an essential oil or absolute."],
  ["Palm oil", "Not in any bar, in any form."],
  ["Sulfates and detergents", "Real soap cleans on its own. There’s nothing to add."],
  ["Parabens and preservatives", "A cured bar of soap doesn’t need them."],
  ["Artificial colour", "Colour comes from clays, roots and petals, or not at all."],
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
            Natural isn’t the same as gentle for everyone. Essential oils can
            irritate skin that reacts easily, so check each bar’s ingredients,
            try a little on your inner arm first, and{" "}
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
