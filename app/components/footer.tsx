import Link from "next/link";
import { footerNav, inWords, site } from "@/lib/site";
import { Rule } from "./ornament";

export default function Footer() {
  return (
    <footer className="mt-auto bg-night text-on-night">
      <div className="wrap grid gap-14 pb-14 pt-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Link href="/" className="font-display text-[3.4rem] leading-none">
            ochar
          </Link>
          <p className="mt-5 max-w-sm text-on-night-muted">
            Homemade, all-natural soap. Poured in small batches, cured for{" "}
            {inWords(site.cureWeeks)} weeks and cut by hand.
          </p>
          <Rule className="mt-8 w-28 text-apricot-300/70" />
          <p className="mt-6 font-display text-[1.6rem] leading-snug text-apricot-200">
            From {site.family} to you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="font-serif text-[0.74rem] uppercase tracking-[0.18em] text-on-night-muted">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[1.05rem] transition-colors hover:text-apricot-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-on-night/12">
        <div className="wrap flex flex-col gap-3 py-6 text-[0.95rem] text-on-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}
            {site.location ? ` · Made by hand in ${site.location}` : ""}
          </p>
          <p className="flex gap-6">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-on-night"
            >
              {site.email}
            </a>
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-on-night"
              >
                Instagram
              </a>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
