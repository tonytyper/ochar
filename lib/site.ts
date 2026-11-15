// the facts about the business that show up around the site. anything marked
// PLACEHOLDER is made up and needs a real answer before launch
export const site = {
  name: "ochar",
  // PLACEHOLDER: the name on your business registration / stripe account
  legalName: "Ochar Soap Co.",
  family: "the Tonoyans",
  motto: "Our goal is quality",
  description:
    "Homemade, all-natural soap from the Tonoyan family. Olive oil, shea butter and a six-week cure, cut and boxed by hand.",
  email: "ocharsoap@gmail.com",
  // PLACEHOLDER: city and state, shown in the footer and on the contact page
  location: "",
  // PLACEHOLDER: full instagram url, or leave empty to hide the link
  instagram: "",
  // bars vary. this is about the average
  barWeight: "120 g",
  cureWeeks: 6,

  currency: "usd",
  // money off the soap (not shipping) once an order has this many bars
  discount: { minBars: 6, percent: 10 },
  shipping: {
    // what a customer pays, by the number of bars in the order. set from usps
    // ground advantage commercial prices (oct 2026), about the middle zone. a
    // bar is at most 150 g packed, so with the mailer 1-2 bars go under 1 lb,
    // 3-5 under 2 lb and 6-8 under 3 lb. dollars
    rates: [
      { upTo: 2, price: 8 },
      { upTo: 5, price: 10.5 },
      { upTo: 8, price: 12.5 },
      { upTo: Infinity, price: 15 },
    ],
    // two-letter country codes stripe will accept a shipping address for
    countries: ["US"],
    processingDays: "2 to 4 business days",
    // how long after delivery a wrong item can be reported. the only case
    // that gets a refund or replacement: all other sales are final
    claimDays: 14,
    transitDays: { min: 3, max: 7 },
  },

  // shown at the top of the privacy and terms pages
  policiesUpdated: "October 2026",
};

// where a bar is: on the shelf, on the curing rack, or gone until next time
export type SoapStatus = "for-sale" | "curing" | "out-of-stock";

export const STATUSES: { status: SoapStatus; title: string; blurb: string }[] = [
  {
    status: "for-sale",
    title: "For sale",
    blurb: "Cured, boxed and ready to send.",
  },
  {
    status: "curing",
    title: "Curing",
    blurb: "On the rack now. These can’t be ordered until the cure is done.",
  },
  {
    status: "out-of-stock",
    title: "Out of stock",
    blurb: "Sold out for now, and back after the next batch.",
  },
];

// the most of one bar a cart can hold
export const MAX_QUANTITY = 20;

// the choices in the contact form's "what is it about" menu
export const contactTopics = [
  "An order",
  "A bar",
  "Gifts or wholesale",
  "Something else",
];

export const mainNav = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/ingredients", label: "Ingredients" },
];

export const secondaryNav = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All soaps" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/ingredients", label: "Ingredients" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/shipping-returns", label: "Shipping & returns" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms of sale" },
    ],
  },
];

// the address the site lives at. set NEXT_PUBLIC_SITE_URL once there's a
// domain. until then vercel's own url is used
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

const WORDS = "zero one two three four five six seven eight nine ten eleven twelve".split(" ");

// small numbers read better spelled out in running text
export function inWords(n: number, capitalize = false) {
  const word = WORDS[n] ?? String(n);
  return capitalize ? word[0].toUpperCase() + word.slice(1) : word;
}

export function formatPrice(price: number) {
  return "$" + price.toFixed(price % 1 === 0 ? 0 : 2);
}

// shipping for an order of this many bars, in dollars
export function shippingCost(bars: number) {
  const { rates } = site.shipping;
  if (bars <= 0) return 0;
  return (rates.find((rate) => bars <= rate.upTo) ?? rates[rates.length - 1]).price;
}

// the discount on an order, in dollars, rounded to the cent like stripe does
export function discountFor(bars: number, subtotal: number) {
  const { minBars, percent } = site.discount;
  if (bars < minBars) return 0;
  const cents = Math.round(subtotal * 100);
  return Math.round((cents * percent) / 100) / 100;
}

// "10% off six or more bars"
export function discountLine() {
  const { minBars, percent } = site.discount;
  return `${percent}% off ${inWords(minBars)} or more bars`;
}

// the rates as rows to show: "One or two bars", $8
export function shippingRates() {
  const { rates } = site.shipping;
  return rates.map((rate, i) => {
    const from = i === 0 ? 1 : rates[i - 1].upTo + 1;
    const label =
      rate.upTo === Infinity
        ? `${inWords(from, true)} or more bars`
        : rate.upTo === from + 1
          ? `${inWords(from, true)} or ${inWords(rate.upTo)} bars`
          : `${inWords(from, true)} to ${inWords(rate.upTo)} bars`;
    return { label, price: rate.price };
  });
}

// one sentence for the faq and product pages
export function shippingSentence() {
  const { rates } = site.shipping;
  const [first, ...rest] = rates;
  return `Shipping goes by the number of bars: ${formatPrice(first.price)} for ${
    first.upTo === 1 ? "one" : `up to ${inWords(first.upTo)}`
  }, rising to ${formatPrice(rest.length ? rest[rest.length - 1].price : first.price)} for a big order.`;
}
