import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

// the storage bucket product photos live in
export const IMAGE_BUCKET = "product-images";

// returns null when the env vars are missing, so the app can fall back to the
// local catalogue. this file used to call createClient straight away, which
// crashed every page whenever the variables weren't set.
export function getSupabase() {
  if (!url || !publishableKey) {
    return null;
  }

  return createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
}

// full access, for writing orders and contact messages. server only, and
// never handed to the browser
export function getSupabaseAdmin() {
  if (!url || !secretKey) {
    return null;
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// whether there is a database to save orders and messages to
export function canSave() {
  return Boolean(url && secretKey);
}

// image_url can be a full url, a path in /public, or just a file name in the
// product-images bucket. this turns the last kind into a public url
export function resolveImage(path: string | null | undefined) {
  if (!path) {
    return null;
  }
  if (/^https?:\/\//.test(path) || path.startsWith("/")) {
    return path;
  }
  if (!url) {
    return null;
  }

  const key = path.startsWith(`${IMAGE_BUCKET}/`)
    ? path.slice(IMAGE_BUCKET.length + 1)
    : path;
  return `${url}/storage/v1/object/public/${IMAGE_BUCKET}/${encodeURI(key)}`;
}
