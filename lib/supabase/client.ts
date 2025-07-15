import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Buat client Supabase untuk digunakan di komponen sisi client (browser)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
