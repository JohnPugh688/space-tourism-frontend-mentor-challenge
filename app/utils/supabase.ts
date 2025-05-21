import { createClient } from '@supabase/supabase-js'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
  }
}

// Validate environment variables with fallbacks for safety
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gkldcniwnivpxwvskjwp.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGRjbml3bml2cHh3dnNranciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0Nzg1NDYwNCwiZXhwIjoyMDYzNDMwNjA0fQ.-R-PGQ_nYpW36_L4t3Iohn8-F7xN4DR04xVafQAIkaE'

// Log environment info in non-production environments or debug mode
if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Supabase URL length:', SUPABASE_URL?.length)
  console.log('Supabase Key length:', SUPABASE_ANON_KEY?.length)
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': '@supabase/auth-helpers-remix',
    },
  },
  // Use direct connection to Supavisor for better performance
  db: {
    schema: 'public',
  },
  // Optimize for short connections
  realtime: {
    params: {
      eventsPerSecond: 1,
    },
  },
})

// Export a helper function to check connection
export async function checkSupabaseConnection() {
  try {
    const start = Date.now()
    const { data, error } = await supabase.from('destinations').select('count').limit(1)
    const end = Date.now()

    if (error) {
      console.error('Supabase connection error:', error)
      return { ok: false, error, latency: end - start }
    }

    return { ok: true, data, latency: end - start }
  } catch (err) {
    console.error('Unexpected Supabase error:', err)
    return { ok: false, error: err, latency: -1 }
  }
}
