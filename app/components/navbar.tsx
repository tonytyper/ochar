"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartCount } from "@/lib/cart";
import { formatPrice, mainNav, secondaryNav, site } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const current = isCurrent(pathname, href);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`text-[0.8rem] uppercase tracking-[0.16em] underline-offset-[0.5em] transition-colors hover:text-primary ${
        current ? "text-primary underline decoration-1" : "text-ink-soft"
      }`}
    >
      {label}
    </Link>
  );
}

function CartLink({ onClick }: { onClick: () => void }) {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      onClick={onClick}
      className="text-[0.8rem] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-primary"
    >
      Cart
      {count ? (
        <span className="ml-1.5 tabular-nums lining-nums text-primary">
          ({count})
          <span className="sr-only"> items</span>
        </span>
      ) : null}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const freeOver = site.shipping.freeOver;

  return (
    <>
      <p className="bg-primary px-4 py-2 text-center text-[0.74rem] uppercase tracking-[0.18em] text-parchment-50">
        {freeOver
          ? `Free shipping on orders over ${formatPrice(freeOver)}`
          : "Small batches, cut and wrapped by hand"}
      </p>

      <header className="paper sticky top-0 z-40 border-b border-line">
        <div className="wrap grid h-[4.6rem] grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[5.4rem]">
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {mainNav.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </nav>

          <button
            type="button"
            className="flex items-center gap-2.5 justify-self-start text-[0.8rem] uppercase tracking-[0.16em] text-ink-soft lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>

          <Link
            href="/"
            className="font-display text-[2.1rem] leading-none text-primary lg:text-[2.6rem]"
            onClick={() => setOpen(false)}
          >
            ochar
            <span className="sr-only"> soap, home</span>
          </Link>

          <div className="flex items-center justify-end gap-8">
            <nav
              aria-label="Help"
              className="hidden items-center gap-8 lg:flex"
            >
              {secondaryNav.map((link) => (
                <NavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>
            <CartLink onClick={() => setOpen(false)} />
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Menu"
            className="paper absolute inset-x-0 top-full border-b border-line shadow-[0_24px_40px_-24px_rgb(43_31_27/0.35)] lg:hidden"
          >
            <ul className="wrap flex flex-col py-6">
              {[...mainNav, ...secondaryNav].map((link) => (
                <li key={link.href} className="border-b border-line last:border-0">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      isCurrent(pathname, link.href) ? "page" : undefined
                    }
                    className="block py-3.5 font-display text-[1.9rem] leading-tight text-ink aria-[current=page]:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
