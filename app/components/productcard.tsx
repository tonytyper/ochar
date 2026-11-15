import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import ProductImage from "./productart";
import QuickAdd from "./quickadd";

export const GRID = "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4";

export default function ProductCard({
  product,
  sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw",
  preload = false,
}: {
  product: Product;
  sizes?: string;
  preload?: boolean;
}) {
  // the label photo shows on hover, with the ingredients on it
  const second = product.image ? product.gallery[0] : undefined;
  const faded = !product.in_stock && product.status !== "curing";

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-photo overflow-hidden bg-sunken">
          <ProductImage
            product={product}
            sizes={sizes}
            preload={preload}
            className={`transition-transform duration-[900ms] ease-gentle group-hover:scale-[1.03] ${
              faded ? "opacity-70 saturate-50" : ""
            }`}
          />
          {second && (
            <ProductImage
              product={product}
              src={second}
              sizes={sizes}
              alt=""
              className="opacity-0 transition-opacity duration-500 ease-gentle group-hover:opacity-100"
            />
          )}
          {!product.in_stock && (
            <span className="absolute left-2.5 top-2.5 bg-surface/90 px-2 py-0.5 text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft">
              {product.status === "curing" ? "Curing" : "Sold out"}
            </span>
          )}
        </div>

        <div className="mt-3.5 flex items-baseline justify-between gap-3">
          <h3 className="text-[1.3rem] leading-tight text-ink transition-colors group-hover:text-primary sm:text-[1.55rem]">
            {product.name}
          </h3>
          <span className="shrink-0 tabular-nums lining-nums text-ink-soft sm:text-lg">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-[0.9rem] text-muted">No. {product.number}</p>
        <p className="mt-1.5 hidden max-w-[34ch] text-[1rem] leading-snug text-ink-soft sm:block">
          {product.summary}
        </p>
      </Link>

      {product.in_stock && (
        <div className="mt-auto pt-4">
          <QuickAdd slug={product.slug} name={product.name} left={product.quantity} />
        </div>
      )}
    </div>
  );
}
