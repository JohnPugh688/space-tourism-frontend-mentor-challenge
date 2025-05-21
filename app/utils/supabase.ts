import { createClient } from '@supabase/supabase-js'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
  }
}

if (typeof process.env.SUPABASE_URL !== 'string' || typeof process.env.SUPABASE_ANON_KEY !== 'string') {
  throw new Error('Missing required Supabase environment variables')
}

// Create client with improved configuration
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Since this is server-side
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: fetch.bind(globalThis),
    headers: {
      'x-client-info': 'remix',
    },
  },
  db: {
    schema: 'public',
  },
})
