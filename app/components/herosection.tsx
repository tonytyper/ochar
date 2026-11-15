import Link from "next/link";
import type { Product } from "@/lib/products";
import { inWords, site } from "@/lib/site";
import HeroCarousel from "./herocarousel";
import { Label } from "./productart";

// box shots only (the first photo of each bar), so no ingredient labels
export default function HeroSection({ products }: { products: Product[] }) {
  const slides = products
    .filter((product) => product.image)
    .sort((a, b) => Number(!a.in_stock) - Number(!b.in_stock))
    .map((product) => ({
      src: product.image as string,
      name: product.name,
      number: product.number,
      slug: product.slug,
    }));

  return (
    <section className="wrap grid items-center gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-14">
      <div className="lg:col-span-5 lg:pr-6">
        <h1 className="text-hero text-ink animate-rise">
          Soap, made slowly and by hand.
        </h1>
        <p className="mt-7 max-w-120 text-[1.3rem] leading-relaxed text-ink-soft animate-rise [animation-delay:90ms]">
          Olive oil, shea butter and a {inWords(site.cureWeeks)}-week cure. Every
          bar is poured, cut and boxed by our family, about ten at a time.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5 animate-rise [animation-delay:180ms]">
          <Link href="/shop" className="btn btn-primary">
            Shop the soaps
          </Link>
          <Link href="/about" className="link text-lg text-ink">
            Read our story
          </Link>
        </div>
      </div>

      <div className="-order-1 lg:order-0 lg:col-span-7 animate-rise [animation-duration:1200ms]">
        {slides.length ? (
          <HeroCarousel slides={slides} />
        ) : (
          <div className="relative aspect-photo overflow-hidden bg-sunken">
            <Label
              tone={{
                ground: "var(--color-pomegranate-600)",
                ink: "var(--color-primary)",
              }}
              tilt={-1.2}
              title="Handmade Soap"
              line={`From ${site.family} to you`}
              label="The ochar soap label"
            />
          </div>
        )}
      </div>
    </section>
  );
}
