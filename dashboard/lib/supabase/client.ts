import { createBrowserClient } from "@supabase/ssr";

/** Cliente Supabase para Client Components (usa la anon key, sujeto a RLS). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
