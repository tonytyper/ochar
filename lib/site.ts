// the facts about the business that show up around the site. anything marked
// PLACEHOLDER is made up and needs a real answer before launch
export const site = {
  name: "ochar",
  // PLACEHOLDER: the name on your business registration / stripe account
  legalName: "Ochar Soap Co.",
  family: "the Tonoyans",
  description:
    "Homemade, all-natural soap from the Tonoyan family. Plant oils, real botanicals and a six-week cure, cut and wrapped by hand.",
  // PLACEHOLDER
  email: "hello@ocharsoap.com",
  // PLACEHOLDER: city and state, shown in the footer and on the contact page
  location: "",
  // PLACEHOLDER: full instagram url, or leave empty to hide the link
  instagram: "",
  // PLACEHOLDER: weigh a cured bar
  barWeight: "4 oz",
  cureWeeks: 6,

  currency: "usd",
  shipping: {
    // PLACEHOLDER: all in dollars
    flatRate: 6,
    freeOver: 50,
    // two-letter country codes stripe will accept a shipping address for
    countries: ["US"],
    processingDays: "2 to 4 business days",
    // how long after delivery a damaged or wrong order can be reported
    claimDays: 14,
    // how long after delivery an unopened order can be sent back
    returnDays: 30,
    transitDays: { min: 3, max: 7 },
  },

  // a landscape photo for the top of the home page. a path in /public, a file
  // in the supabase product-images bucket, or a full url. empty uses the label
  heroImage: "",

  // shown at the top of the privacy and terms pages
  policiesUpdated: "October 2026",
};

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
