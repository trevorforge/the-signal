import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client (anon key) — for reading data in server components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service client — for writing data in API routes
export function getServiceClient() {
  if (!supabaseServiceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(supabaseUrl, supabaseServiceKey);
}

export function isSupabaseBackend(): boolean {
  return process.env.STORAGE_BACKEND === "supabase";
}
