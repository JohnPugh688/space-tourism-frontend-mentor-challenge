import { createClient } from '@supabase/supabase-js'

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables')
}

// Create client with timeout options
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Since this is server-side
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
})
