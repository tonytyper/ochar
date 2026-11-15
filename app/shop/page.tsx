import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import ProductCard from "@/app/components/productcard";
import { getProducts, type Product } from "@/lib/products";
import { formatPrice, inWords, site, STATUSES, type SoapStatus } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every ochar soap, with what's in it. Small-batch, cold process bars, cut and boxed by hand.",
};

// a for-sale bar that has run out shows with the sold out ones
function shelf(product: Product): SoapStatus {
  if (product.status === "curing") return "curing";
  return product.in_stock ? "for-sale" : "out-of-stock";
}

export default async function ShopPage() {
  const products = await getProducts();
  const groups = STATUSES.map((group) => ({
    ...group,
    // bars with photos first
    products: products
      .filter((product) => shelf(product) === group.status)
      .sort((a, b) => Number(!a.image) - Number(!b.image)),
  })).filter((group) => group.products.length > 0);

  return (
    <>
      <PageHeader eyebrow="The shop" title="The soaps">
        <p>
          Every bar is cured for {inWords(site.cureWeeks)} weeks and cut by
          hand. Each one is numbered, so you can always find the same batch
          again.
        </p>
        <nav aria-label="Shop sections" className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[0.8rem] uppercase tracking-[0.16em]">
          {groups.map((group) => (
            <a key={group.status} href={`#${group.status}`} className="link text-ink-soft">
              {group.title}{" "}
              <span className="tabular-nums lining-nums text-muted">
                ({group.products.length})
              </span>
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="wrap pb-24 lg:pb-32">
        {groups.map((group, g) => (
          <section
            key={group.status}
            id={group.status}
            className={`border-t border-line pt-10 ${g > 0 ? "mt-20 lg:mt-28" : ""}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className="text-section">{group.title}</h2>
              <p className="text-ink-soft">{group.blurb}</p>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {group.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  preload={g === 0 && i < 3}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-line bg-sunken">
        <dl className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {[
            ["Every bar", `About ${site.barWeight}, cut by hand, so no two are quite the same size.`],
            ["Ingredients", "Listed in full on each bar's page, just as on the box."],
            ["Shipping", `Sent within ${site.shipping.processingDays}. ${site.shipping.freeOver ? `Free on orders over ${formatPrice(site.shipping.freeOver)}.` : ""}`],
            ["Sensitive skin", "Patch test a new bar first, and ask us if you are unsure which to choose."],
          ].map(([term, detail]) => (
            <div key={term}>
              <dt className="font-display text-[1.45rem]">{term}</dt>
              <dd className="mt-2 text-ink-soft">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="wrap pb-16 text-ink-soft lg:pb-20">
          Questions about a bar?{" "}
          <Link href="/contact" className="link text-ink">
            Write to us
          </Link>{" "}
          or read the{" "}
          <Link href="/faq" className="link text-ink">
            FAQ
          </Link>
          .
        </p>
      </section>
    </>
  );
}
