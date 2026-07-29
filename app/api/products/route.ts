import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

//GET function to hand back the product list as json.
//the pages don't use this - they call getProducts() themselves, since a page
//fetching its own api is just a round trip back to the same server. this is
//here for anything outside the site that wants the catalogue.
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
