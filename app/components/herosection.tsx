import Image from "next/image";
import Link from "next/link";
import { inWords, site } from "@/lib/site";
import { resolveImage } from "@/lib/supabase";
import { Label } from "./productart";

export default function HeroSection() {
  const photo = resolveImage(site.heroImage);

  return (
    <section className="wrap grid items-center gap-10 pb-20 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-16">
      <div className="lg:col-span-5 lg:pr-6">
        <p className="eyebrow animate-rise">Small-batch soap · Cold process</p>
        <h1 className="mt-5 text-hero text-ink animate-rise [animation-delay:90ms]">
          Soap, made slowly and by hand.
        </h1>
        <p className="mt-7 max-w-120 text-[1.3rem] leading-relaxed text-ink-soft animate-rise [animation-delay:180ms]">
          Plant oils, real botanicals and a {inWords(site.cureWeeks)}-week cure. Every
          bar is poured, cut and wrapped by our family, a few dozen at a time.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5 animate-rise [animation-delay:270ms]">
          <Link href="/shop" className="btn btn-primary">
            Shop the soaps
          </Link>
          <Link href="/about" className="link text-lg text-ink">
            Read our story
          </Link>
        </div>
      </div>

      <div className="-order-1 lg:order-0 lg:col-span-7">
        <div className="relative aspect-photo overflow-hidden bg-sunken animate-rise [animation-duration:1200ms]">
          {photo ? (
            <Image
              src={photo}
              alt="ochar soap bars"
              fill
              preload
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}
