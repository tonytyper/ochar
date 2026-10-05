import type { Metadata } from "next";
import CartView from "@/app/components/cartview";
import PageHeader from "@/app/components/pageheader";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";
import { checkoutEnabled } from "@/lib/stripe";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default async function CartPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader eyebrow="The shop" title="Your cart" />
      <section className="wrap pb-24 lg:pb-32">
        <CartView
          products={products}
          checkoutEnabled={checkoutEnabled()}
          flatRate={site.shipping.flatRate}
          freeOver={site.shipping.freeOver}
          email={site.email}
        />
      </section>
    </>
  );
}
