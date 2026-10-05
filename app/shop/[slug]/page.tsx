import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/app/components/addtocart";
import Disclosure from "@/app/components/disclosure";
import ProductImage from "@/app/components/productart";
import ProductCard from "@/app/components/productcard";
import { getOtherProducts, getProduct, getProducts } from "@/lib/products";
import { formatPrice, site, siteUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} · ochar`,
      description: product.summary,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const others = await getOtherProducts(slug, 3);
  const photos = [product.image, ...product.gallery].filter(
    (src): src is string => Boolean(src),
  );
  const { shipping } = site;
  // whichever column is shorter stays in view while the other scrolls
  const stickyPhotos = photos.length <= 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: photos.length ? photos : undefined,
    brand: { "@type": "Brand", name: "ochar" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: site.currency.toUpperCase(),
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl()}/shop/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" className="wrap pt-8 lg:pt-10">
        <ol className="flex items-center gap-2.5 text-[0.95rem] text-muted">
          <li>
            <Link href="/shop" className="link">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-soft">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="wrap grid gap-10 pb-24 pt-6 lg:grid-cols-12 lg:gap-14 lg:pb-32">
        <div
          className={`space-y-4 self-start lg:col-span-7 ${stickyPhotos ? "lg:sticky lg:top-32" : ""}`}
        >
          {(photos.length ? photos : [null]).map((src, i) => (
            <div
              key={src ?? "label"}
              className="relative aspect-photo overflow-hidden bg-sunken"
            >
              <ProductImage
                product={product}
                src={src}
                sizes="(min-width: 1024px) 56vw, 100vw"
                preload={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className={stickyPhotos ? "" : "lg:sticky lg:top-32"}>
            <p className="eyebrow">
              No. {String(product.number).padStart(2, "0")} · Handmade soap
            </p>
            <h1 className="mt-3 text-title">{product.name}</h1>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="text-[1.6rem] text-ink">
                {formatPrice(product.price)}
              </span>
              <span className="text-muted">· about {site.barWeight}</span>
            </p>
            <p className="mt-6 text-[1.3rem] leading-relaxed text-ink-soft">
              {product.summary}
            </p>

            <div className="mt-9">
              <AddToCart
                slug={product.slug}
                price={product.price}
                inStock={product.in_stock}
              />
            </div>

            {product.ingredients.length > 0 && (
              <div className="mt-8 border-t border-line pt-8">
                <h2 className="eyebrow font-serif">Ingredients</h2>
                <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  {product.ingredients.map((ingredient) => (
                    <li
                      key={ingredient}
                      className="flex items-baseline gap-3 border-b border-line/70 py-2"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-accent"
                      />
                      {ingredient}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">
                  The oils are turned into soap with lye (sodium hydroxide),
                  and none is left in the finished bar.{" "}
                  <Link href="/ingredients" className="link text-ink-soft">
                    More about our ingredients
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-line">
              <Disclosure title="Making it last">
                <p>
                  Keep the bar out of standing water and let it dry between
                  uses on a dish that drains. A dry bar stays hard and lasts
                  weeks longer than one left in a puddle.
                </p>
              </Disclosure>
              <Disclosure title="Shipping and returns">
                <p>
                  Orders are sent within {shipping.processingDays}.{" "}
                  {shipping.freeOver
                    ? `Shipping is ${formatPrice(shipping.flatRate)}, and free on orders over ${formatPrice(shipping.freeOver)}.`
                    : `Shipping is ${formatPrice(shipping.flatRate)}.`}
                </p>
                <p>
                  Something arrived damaged? Write to us within{" "}
                  {shipping.claimDays} days and we’ll put it right.{" "}
                  <Link href="/shipping-returns" className="link text-ink">
                    Full details
                  </Link>
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="wrap py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-section">Other bars</h2>
              <Link href="/shop" className="link text-lg text-ink">
                See all soaps
              </Link>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <ProductCard key={other.id} product={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
