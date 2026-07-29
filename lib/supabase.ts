import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// returns null when the env vars are missing, so the app can fall back to the
// local catalogue. this file used to call createClient straight away, which
// crashed every page whenever the variables weren't set.
export function getSupabase() {
  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}
