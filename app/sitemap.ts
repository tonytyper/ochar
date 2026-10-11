import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const PAGES = [
  "",
  "/shop",
  "/about",
  "/ingredients",
  "/faq",
  "/contact",
  "/shipping-returns",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const products = await getProducts();

  return [
    ...PAGES.map((path) => ({
      url: base + path,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${base}/shop/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
