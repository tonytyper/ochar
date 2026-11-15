import "server-only";
import { cache } from "react";
import type { SoapStatus } from "@/lib/site";
import { getSupabase, resolveImage } from "@/lib/supabase";

// the paper label drawn for a bar with no photo: a colored ground, and the ink
// the label is printed in
export interface Tone {
  ground: string;
  ink: string;
}

export interface Product {
  id: string;
  slug: string;
  // the soap's number, as written on its box (#37)
  number: number;
  name: string;
  summary: string;
  ingredients: string[];
  price: number;
  image: string | null;
  gallery: string[];
  status: SoapStatus;
  // bars on hand when for sale, bars on the rack when curing. null if unknown
  quantity: number | null;
  // for sale and not run out: the only state a bar can be bought in
  in_stock: boolean;
  tone: Tone;
}

export const TONES = {
  lavender: { ground: "#d6cde3", ink: "#4b3d66" },
  sea: { ground: "#c7d6d6", ink: "#2d4f53" },
  orris: { ground: "#e0cbd0", ink: "#6a3446" },
  chamomile: { ground: "#cbd5e0", ink: "#33476a" },
  apricot: { ground: "#ecdac8", ink: "#7a4630" },
  sage: { ground: "#cfd4bc", ink: "#47522f" },
  oat: { ground: "#e7dfd0", ink: "#5a4b3d" },
  fir: { ground: "#bfcab8", ink: "#2f4636" },
  rose: { ground: "#e6cbc5", ink: "#74343a" },
  clay: { ground: "#dcc4ae", ink: "#6b3f26" },
} satisfies Record<string, Tone>;

export type ToneName = keyof typeof TONES;
const TONE_ORDER = Object.keys(TONES) as ToneName[];

// a row from the supabase products table. see supabase/schema.sql. only name
// and price are really required, everything else has a fallback
interface ProductRow {
  id: string | number;
  name: string;
  price: number | string | null;
  slug?: string | null;
  description?: string | null;
  ingredients?: string[] | string | null;
  image_url?: string | null;
  gallery?: string[] | null;
  number?: number | null;
  status?: string | null;
  quantity?: number | null;
  // older tables only had this. used when there is no status column
  in_stock?: boolean | null;
  tone?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ingredients can be a postgres array or one comma separated string
function toList(value: ProductRow["ingredients"]) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(/[,\n]/);
  return list.map((item) => item.trim()).filter(Boolean);
}

const STATUS_VALUES: SoapStatus[] = ["for-sale", "curing", "out-of-stock"];

function toStatus(row: ProductRow): SoapStatus {
  if (row.status && (STATUS_VALUES as string[]).includes(row.status)) {
    return row.status as SoapStatus;
  }
  return row.in_stock === false ? "out-of-stock" : "for-sale";
}

function fromRow(row: ProductRow, index: number): Product {
  const number = row.number ?? index + 1;
  const status = toStatus(row);
  const quantity = row.quantity ?? null;
  const tone =
    row.tone && row.tone in TONES
      ? TONES[row.tone as ToneName]
      : TONES[TONE_ORDER[index % TONE_ORDER.length]];

  return {
    id: String(row.id),
    slug: row.slug || `${slugify(row.name)}-${number}`,
    number,
    name: row.name,
    summary: row.description || "",
    ingredients: toList(row.ingredients),
    price: Number(row.price || 0),
    image: resolveImage(row.image_url),
    gallery: (row.gallery || [])
      .map((path) => resolveImage(path))
      .filter((path): path is string => Boolean(path)),
    status,
    quantity,
    in_stock: status === "for-sale" && (quantity === null || quantity > 0),
    tone,
  };
}

function byShopOrder(a: ProductRow, b: ProductRow) {
  const order = (a.sort_order ?? 0) - (b.sort_order ?? 0);
  if (order !== 0) return order;
  return String(a.created_at ?? "").localeCompare(String(b.created_at ?? ""));
}

// postgres / postgrest codes for "there is no products table"
const NO_TABLE = ["42P01", "PGRST205"];

// every product in the shop. uses the supabase products table when there is
// one, and the catalogue at the bottom of this file when there isn't (no env
// vars, no table, or an empty table). cached per request so a page and its
// metadata share one query
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = getSupabase();

  if (!supabase) {
    return CATALOGUE;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .abortSignal(AbortSignal.timeout(8000));

  if (error && !NO_TABLE.includes(error.code)) {
    // in production this throws rather than quietly swapping in the stand-in
    // catalogue: a page keeps its last good version, and checkout refuses
    // instead of charging made-up prices
    if (process.env.NODE_ENV === "production") {
      throw new Error(`products query failed: ${error.message}`);
    }
    console.warn(`products query failed, using the catalogue: ${error.message}`);
    return CATALOGUE;
  }
  if (!data || data.length === 0) {
    return CATALOGUE;
  }

  return (data as ProductRow[]).sort(byShopOrder).map(fromRow);
});

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getFeaturedProducts(limit = 3) {
  const products = await getProducts();
  return products
    .filter((product) => product.in_stock)
    .sort((a, b) => Number(!a.image) - Number(!b.image))
    .slice(0, limit);
}

// a few other bars to show under a product, starting after it in the
// catalogue so each page suggests something different
export async function getOtherProducts(slug: string, limit = 3) {
  const products = await getProducts();
  const at = products.findIndex((product) => product.slug === slug);
  const rest = [...products.slice(at + 1), ...products.slice(0, at)];
  return rest.filter((product) => product.in_stock).slice(0, limit);
}

// what's on the base of every bar, from the labels on the boxes
const BASE = [
  "Olive oil",
  "Shea butter",
  "Castor oil",
  "Coconut oil",
  "Vitamin E",
  "Lye (sodium hydroxide)",
  "Water",
];

// PLACEHOLDER: no prices yet, so every bar is $12 until there are real ones
const PRICE = 12;

// the catalogue, used until there's a supabase products table. names, numbers,
// quantities and status come from the stock list; ingredients from the labels
const CATALOGUE_ROWS: (ProductRow & { tone: ToneName })[] = [
  {
    id: "34",
    number: 34,
    slug: "rose-34",
    name: "Rose",
    description:
      "Pink and deep blue swirls through a white bar, with a Rose and Hiqili scent.",
    ingredients: [
      ...BASE,
      "Red-blue mica",
      "Universal blue mica",
      "Rose and Hiqili scent",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 8,
    image_url: "/products/rose-34-1.jpg",
    gallery: ["/products/rose-34-2.jpg"],
    tone: "rose",
  },
  {
    id: "37",
    number: 37,
    slug: "ocean-breeze-37",
    name: "Ocean Breeze",
    description:
      "Charcoal and sea-green swirls around a pink heart, with a fresh Ocean Breeze scent.",
    ingredients: [
      ...BASE,
      "Ocean Breeze scent",
      "Black mica",
      "Fruit green mica",
      "Activated charcoal",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 8,
    image_url: "/products/ocean-breeze-37-1.jpg",
    gallery: ["/products/ocean-breeze-37-2.jpg"],
    tone: "sea",
  },
  {
    id: "50",
    number: 50,
    slug: "sweet-tobacco-50",
    name: "Sweet Tobacco",
    description:
      "Red and green swirls around a blue heart, with a warm Sweet Tobacco scent.",
    ingredients: [
      ...BASE,
      "Sweet Tobacco scent",
      "Titanium dioxide",
      "Fruit green mica",
      "Red mica",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 11,
    image_url: "/products/sweet-tobacco-50-1.jpg",
    gallery: ["/products/sweet-tobacco-50-2.jpg"],
    tone: "clay",
  },
  {
    id: "38",
    number: 38,
    slug: "lavender-38",
    name: "Lavender",
    description:
      "Red, yellow and green swirls around a blue heart, scented with lavender.",
    ingredients: [
      ...BASE,
      "Red mica",
      "Green mica",
      "Yellow mica",
      "Blue mica",
      "Lavender scent",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 10,
    image_url: "/products/lavender-38-1.jpg",
    gallery: ["/products/lavender-38-2.jpg"],
    tone: "lavender",
  },
  {
    id: "2",
    number: 2,
    slug: "neem-2",
    name: "Neem",
    description: "Neem seed oil in a plain bar, with no scent and no colour.",
    ingredients: [
      "Olive oil",
      "Shea butter",
      "Castor oil",
      "Coconut oil",
      "Neem seed oil",
      "Vitamin E",
      "Lye (sodium hydroxide)",
      "Water",
      "Sodium lactate",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 9,
    image_url: "/products/neem-2-1.jpg",
    gallery: ["/products/neem-2-2.jpg"],
    tone: "oat",
  },
  {
    id: "49",
    number: 49,
    slug: "morning-rain-49",
    name: "Morning Rain",
    description:
      "Ribbons of red and yellow through a white bar, with a clean Morning Rain scent.",
    ingredients: [
      ...BASE,
      "Morning Rain scent",
      "Red mica",
      "Lemon yellow mica",
      "Titanium dioxide",
    ],
    price: PRICE,
    // the stock list doesn't say. assumed for sale
    status: "for-sale",
    quantity: 10,
    image_url: "/products/morning-rain-49-1.jpg",
    gallery: ["/products/morning-rain-49-2.jpg"],
    tone: "apricot",
  },
  {
    id: "11",
    number: 11,
    slug: "rose-11",
    name: "Rose",
    description:
      "Slate blue with ribbons of pink and purple, scented with Hiqili rose.",
    ingredients: [
      ...BASE,
      "Hiqili Rose scent",
      "Universal blue mica",
      "Purple rose mica",
      "Red-blue mica",
    ],
    price: PRICE,
    status: "for-sale",
    quantity: 10,
    image_url: "/products/rose-11-1.jpg",
    gallery: ["/products/rose-11-2.jpg"],
    tone: "orris",
  },
  {
    id: "32",
    number: 32,
    slug: "lilac-32",
    name: "Lilac",
    description:
      "Soft purple swirled with deep red and yellow, scented with lilac.",
    ingredients: [
      ...BASE,
      "Purple rose mica",
      "Lemon yellow mica",
      "Jujube red mica",
      "Lilac scent",
    ],
    price: PRICE,
    status: "curing",
    quantity: 9,
    image_url: "/products/lilac-32-1.jpg",
    gallery: ["/products/lilac-32-2.jpg"],
    tone: "lavender",
  },
  {
    id: "28",
    number: 28,
    slug: "apricot-melon-28",
    name: "Apricot Melon",
    description:
      "Bold blocks of yellow, coral and deep blue, scented with apricot and melon.",
    ingredients: [
      ...BASE,
      "Apricot Melon scent",
      "Yellow mica",
      "Pink mica",
      "Blue mica",
    ],
    price: PRICE,
    status: "curing",
    quantity: 6,
    image_url: "/products/apricot-melon-28-1.jpg",
    gallery: ["/products/apricot-melon-28-2.jpg"],
    tone: "apricot",
  },
  {
    id: "24",
    number: 24,
    slug: "lilac-24",
    name: "Lilac",
    description: "A soft, speckled purple bar scented with lilac.",
    ingredients: [
      "Olive oil",
      "Shea butter",
      "Castor oil",
      "Coconut oil",
      "Vitamin E",
      "Beeswax",
      "Lye (sodium hydroxide)",
      "Water",
      "Purple mica",
      "Lilac scent",
    ],
    price: PRICE,
    status: "out-of-stock",
    quantity: 0,
    image_url: "/products/lilac-24-1.jpg",
    gallery: ["/products/lilac-24-2.jpg"],
    tone: "lavender",
  },
];

export const CATALOGUE: Product[] = CATALOGUE_ROWS.map(fromRow);
