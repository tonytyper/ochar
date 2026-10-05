import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/pageheader";
import ProductCard from "@/app/components/productcard";
import { getProducts } from "@/lib/products";
import { formatPrice, inWords, site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every ochar soap, with what's in it. Small-batch, cold process bars, cut and wrapped by hand.",
};

export default async function ShopPage() {
  const products = await getProducts();
  const inStock = products.filter((product) => product.in_stock).length;

  return (
    <>
      <PageHeader eyebrow="The shop" title="The soaps">
        <p>
          {inWords(products.length, true)} bars, each one cured for{" "}
          {inWords(site.cureWeeks)} weeks and cut by hand.{" "}
          {inStock < products.length &&
            "Anything sold out is back after the next batch."}
        </p>
      </PageHeader>

      <section className="wrap pb-24 lg:pb-32">
        <div className="grid gap-x-8 gap-y-16 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              preload={i < 3}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-sunken">
        <dl className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {[
            ["Every bar", `About ${site.barWeight}, cut by hand, so no two are quite the same size.`],
            ["Ingredients", "Listed in full on each bar's page. No synthetic fragrance, ever."],
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
