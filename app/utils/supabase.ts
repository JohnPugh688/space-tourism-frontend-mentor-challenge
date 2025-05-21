import { createClient } from '@supabase/supabase-js'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
  }
}

// Validate environment variables
if (!process.env.SUPABASE_URL) throw new Error('Missing env.SUPABASE_URL')
if (!process.env.SUPABASE_ANON_KEY) throw new Error('Missing env.SUPABASE_ANON_KEY')

// Log environment info in non-production environments or debug mode
if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
  console.log('Supabase URL:', process.env.SUPABASE_URL)
  console.log('Supabase Key length:', process.env.SUPABASE_ANON_KEY?.length)
  console.log('Environment:', process.env.NODE_ENV)
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
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
