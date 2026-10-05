import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import ProductImage from "./productart";

export default function ProductCard({
  product,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
  preload = false,
}: {
  product: Product;
  sizes?: string;
  preload?: boolean;
}) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-photo overflow-hidden bg-sunken">
        <ProductImage
          product={product}
          sizes={sizes}
          preload={preload}
          className={`transition-transform duration-[900ms] ease-gentle group-hover:scale-[1.03] ${
            product.in_stock ? "" : "opacity-70 saturate-50"
          }`}
        />
        {!product.in_stock && (
          <span className="absolute left-3 top-3 bg-surface/90 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-[1.65rem] leading-tight text-ink transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <span className="shrink-0 text-lg text-ink-soft">
          {formatPrice(product.price)}
        </span>
      </div>
      <p className="mt-1.5 max-w-[34ch] text-[1.02rem] leading-snug text-muted">
        {product.summary}
      </p>
    </Link>
  );
}
