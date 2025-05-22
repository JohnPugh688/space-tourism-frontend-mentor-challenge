import { createClient } from '@supabase/supabase-js'

const supabaseUrl = typeof document === 'undefined' ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey =
  typeof document === 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Using environment variables for Supabase credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
