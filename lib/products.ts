import "server-only";
import { cache } from "react";
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
  // position in the catalogue, printed on labels as "No. 01"
  number: number;
  name: string;
  summary: string;
  ingredients: string[];
  price: number;
  image: string | null;
  gallery: string[];
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

function fromRow(row: ProductRow, index: number): Product {
  const tone =
    row.tone && row.tone in TONES
      ? TONES[row.tone as ToneName]
      : TONES[TONE_ORDER[index % TONE_ORDER.length]];

  return {
    id: String(row.id),
    slug: row.slug || slugify(row.name),
    number: index + 1,
    name: row.name,
    summary: row.description || "",
    ingredients: toList(row.ingredients),
    price: Number(row.price || 0),
    image: resolveImage(row.image_url),
    gallery: (row.gallery || [])
      .map((path) => resolveImage(path))
      .filter((path): path is string => Boolean(path)),
    in_stock: row.in_stock ?? true,
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
  return products.filter((product) => product.in_stock).slice(0, limit);
}

// a few other bars to show under a product, starting after it in the
// catalogue so each page suggests something different
export async function getOtherProducts(slug: string, limit = 3) {
  const products = await getProducts();
  const at = products.findIndex((product) => product.slug === slug);
  const rest = [...products.slice(at + 1), ...products.slice(0, at)];
  return rest.filter((product) => product.in_stock).slice(0, limit);
}

// stand-in catalogue. scent names, copy, ingredients and prices are all
// invented and get replaced by the products table once supabase is set up
const CATALOGUE_ROWS: (ProductRow & { tone: ToneName })[] = [
  {
    id: "lavender-field",
    name: "Lavender Field",
    description:
      "Lavender buds steeped in oat milk. A soft lather and a calm scent that stays with you.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Shea butter",
      "Oat milk",
      "Lavender essential oil",
      "Lavender buds",
      "White kaolin clay",
    ],
    price: 12,
    tone: "lavender",
  },
  {
    id: "sea-mist",
    name: "Sea Mist",
    description:
      "Blue clay and a pinch of sea salt. A dense, mineral bar that rinses completely clean.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Castor oil",
      "Blue kaolin clay",
      "Sea salt",
      "Bergamot essential oil",
      "Petitgrain essential oil",
    ],
    price: 12,
    tone: "sea",
  },
  {
    id: "wild-iris",
    name: "Wild Iris",
    description:
      "Orris root and violet leaf. Powdery and green, old-fashioned in the best way.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Avocado oil",
      "Orris root powder",
      "Violet leaf absolute",
      "Vetiver essential oil",
    ],
    price: 13,
    tone: "orris",
  },
  {
    id: "blue-chamomile",
    name: "Blue Chamomile",
    description:
      "Chamomile, calendula and raw honey. Barely scented, and gentle enough for your face.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Shea butter",
      "German chamomile essential oil",
      "Calendula petals",
      "Raw honey",
    ],
    price: 14,
    tone: "chamomile",
  },
  {
    id: "moonflower",
    name: "Moonflower",
    description:
      "Jasmine and tuberose over coconut milk. Rich and floral, made for a long bath.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Cocoa butter",
      "Coconut milk",
      "Jasmine absolute",
      "Tuberose absolute",
      "Alkanet root",
    ],
    price: 14,
    tone: "apricot",
  },
  {
    id: "rosemary-and-rain",
    name: "Rosemary & Rain",
    description:
      "Rosemary, spearmint and a thread of eucalyptus. The one for early mornings.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Castor oil",
      "Rosemary essential oil",
      "Spearmint essential oil",
      "Eucalyptus essential oil",
      "French green clay",
    ],
    price: 11,
    in_stock: false,
    tone: "sage",
  },
  {
    id: "linen",
    name: "Linen",
    description:
      "Unscented, for sensitive skin. Just oats, white clay and a long, slow cure.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Shea butter",
      "Colloidal oatmeal",
      "White kaolin clay",
    ],
    price: 11,
    tone: "oat",
  },
  {
    id: "first-frost",
    name: "First Frost",
    description:
      "Fir needle, juniper and grapefruit peel. A winter bar, made in small runs until spring.",
    ingredients: [
      "Olive oil",
      "Coconut oil",
      "Fir needle essential oil",
      "Juniper berry essential oil",
      "Grapefruit essential oil",
    ],
    price: 13,
    tone: "fir",
  },
];

export const CATALOGUE: Product[] = CATALOGUE_ROWS.map(fromRow);
