import { getSupabase } from "@/lib/supabase";

// the two colors that a bar's artwork fades between
export interface Tone {
  from: string;
  to: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  notes: string[];
  ingredients: string;
  image_url: string | null;
  in_stock: boolean;
  tone: Tone;
}

// a row as it comes back from supabase. only the first seven columns are
// required and the rest are used if the table has them
interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  in_stock: boolean | null;
  created_at: string;
  slug?: string | null;
  tagline?: string | null;
  notes?: string[] | null;
  ingredients?: string | null;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(price: number) {
  return "$" + price.toFixed(price % 1 === 0 ? 0 : 2);
}

// turns a supabase row into a Product, filling in anything the table doesn't
// have, bars are given a tone in order so the artwork stays varied
function fromRow(row: ProductRow, index: number): Product {
  return {
    id: String(row.id),
    slug: row.slug || slugify(row.name),
    name: row.name,
    tagline: row.tagline || "",
    description: row.description || "",
    price: Number(row.price || 0),
    notes: row.notes || [],
    ingredients: row.ingredients || "",
    image_url: row.image_url,
    in_stock: row.in_stock ?? true,
    tone: TONES[index % TONES.length],
  };
}

// every product in the shop! uses supabase when it's set up, and the
// catalogue below when it isn't. anything going wrong falls back to the
// catalogue too, so the shop always has something to sell
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();

  if (!supabase) {
    return CATALOGUE;
  }

  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error || !data || data.length === 0) {
      return CATALOGUE;
    }

    return data.map(fromRow);
  } catch {
    return CATALOGUE;
  }
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getFeaturedProducts(limit = 3) {
  const products = await getProducts();
  return products.filter((product) => product.in_stock).slice(0, limit);
}

const TONES: Tone[] = [
  { from: "#cab8ef", to: "#f0ebfb" },
  { from: "#a5c2ec", to: "#e5edfb" },
  { from: "#ae94e4", to: "#e1d7f7" },
  { from: "#9db8e8", to: "#eef3fd" },
  { from: "#bcc6f2", to: "#f2f0fd" },
  { from: "#8f9fdd", to: "#e8ecfa" },
  { from: "#c3b3ea", to: "#f5f1fd" },
  { from: "#93b5e4", to: "#e9f1fc" },
];

//dummy catalogue
const CATALOGUE: Product[] = [
  {
    id: "lavender-field",
    slug: "lavender-field",
    name: "Lavender Field",
    tagline: "The one that started it all.",
    description:
      "Whole lavender buds steeped in oat milk, poured slow and cured for six weeks. It lathers soft and leaves the kind of quiet scent you only notice again an hour later.",
    price: 12,
    notes: ["Lavender", "Oat milk", "Cedar"],
    ingredients:
      "Saponified olive, coconut and shea butter oils, oat milk, lavender essential oil, whole lavender buds, kaolin clay.",
    image_url: null,
    in_stock: true,
    tone: TONES[0],
  },
  {
    id: "sea-mist",
    slug: "sea-mist",
    name: "Sea Mist",
    tagline: "Cold water, clean air.",
    description:
      "Blue kaolin clay and a pinch of sea salt make a dense, mineral bar that rinses completely clean. Bracing without being sharp.",
    price: 12,
    notes: ["Sea salt", "Blue clay", "Bergamot"],
    ingredients:
      "Saponified olive, coconut and castor oils, blue kaolin clay, sea salt, bergamot and petitgrain essential oils.",
    image_url: null,
    in_stock: true,
    tone: TONES[1],
  },
  {
    id: "wild-iris",
    slug: "wild-iris",
    name: "Wild Iris",
    tagline: "Powdery, green, a little old-fashioned.",
    description:
      "Orris root gives this bar its soft powdery finish, cut with violet leaf so it stays green rather than sweet. Our most-requested gift bar.",
    price: 13,
    notes: ["Orris root", "Violet leaf", "Vetiver"],
    ingredients:
      "Saponified olive, coconut and avocado oils, orris root powder, violet leaf absolute, vetiver essential oil.",
    image_url: null,
    in_stock: true,
    tone: TONES[2],
  },
  {
    id: "blue-chamomile",
    slug: "blue-chamomile",
    name: "Blue Chamomile",
    tagline: "For skin that argues back.",
    description:
      "German chamomile turns this bar its natural dusk blue, with no colourant at all. Unfussy, low-scent and gentle enough to use on your face.",
    price: 14,
    notes: ["Chamomile", "Calendula", "Honey"],
    ingredients:
      "Saponified olive, coconut and shea butter oils, German chamomile essential oil, calendula petals, raw honey.",
    image_url: null,
    in_stock: true,
    tone: TONES[3],
  },
  {
    id: "moonflower",
    slug: "moonflower",
    name: "Moonflower",
    tagline: "A night-blooming bar.",
    description:
      "Jasmine and tuberose over a base of coconut milk. Rich, floral and deliberately a little indulgent - this is the one for a long bath.",
    price: 14,
    notes: ["Jasmine", "Tuberose", "Coconut milk"],
    ingredients:
      "Saponified olive, coconut and cocoa butter oils, coconut milk, jasmine and tuberose absolutes, alkanet root.",
    image_url: null,
    in_stock: true,
    tone: TONES[4],
  },
  {
    id: "rosemary-and-rain",
    slug: "rosemary-and-rain",
    name: "Rosemary & Rain",
    tagline: "The morning bar.",
    description:
      "Rosemary, spearmint and a thread of eucalyptus. Wakes you up without the sting of a proper peppermint bar.",
    price: 11,
    notes: ["Rosemary", "Spearmint", "Eucalyptus"],
    ingredients:
      "Saponified olive, coconut and castor oils, rosemary, spearmint and eucalyptus essential oils, French green clay.",
    image_url: null,
    in_stock: false,
    tone: TONES[5],
  },
  {
    id: "linen",
    slug: "linen",
    name: "Linen",
    tagline: "Barely scented, on purpose.",
    description:
      "The unscented bar, for sensitive skin and for anyone who would rather not smell like anything at all. Just oats, clay and a long cure.",
    price: 11,
    notes: ["Unscented", "Colloidal oat", "Kaolin"],
    ingredients:
      "Saponified olive, coconut and shea butter oils, colloidal oatmeal, white kaolin clay.",
    image_url: null,
    in_stock: true,
    tone: TONES[6],
  },
  {
    id: "first-frost",
    slug: "first-frost",
    name: "First Frost",
    tagline: "Winter seasonal.",
    description:
      "Fir needle and juniper with a cold snap of grapefruit peel. Made in small runs from November, and gone by spring.",
    price: 13,
    notes: ["Fir needle", "Juniper", "Grapefruit"],
    ingredients:
      "Saponified olive and coconut oils, fir needle, juniper berry and grapefruit essential oils.",
    image_url: null,
    in_stock: true,
    tone: TONES[7],
  },
];
