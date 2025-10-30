
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Lightweight guard to help devs catch missing envs quickly
if (!supabaseUrl || !supabaseAnonKey) {
  // Only log in dev — don't crash on server builds; will fail at runtime if used.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('Missing Supabase env variables in lib/supabaseClient.ts');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
