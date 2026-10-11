import Link from "next/link";
import { Rule, Sprig } from "@/app/components/ornament";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center lg:py-32">
      <Sprig className="h-28 w-12 -rotate-12 text-primary" />
      <p className="eyebrow mt-8">Page not found</p>
      <h1 className="mt-4 text-title">This page has slipped away.</h1>
      <p className="mt-6 max-w-md text-[1.2rem] text-ink-soft">
        Like a bar off a wet dish. The link may be old, or the page may have
        moved.
      </p>
      <Rule className="mt-10 w-32 text-accent" />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
        <Link href="/shop" className="btn btn-primary">
          Shop the soaps
        </Link>
        <Link href="/" className="link text-lg text-ink">
          Back to the start
        </Link>
      </div>
    </section>
  );
}
