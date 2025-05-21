import { createClient } from '@supabase/supabase-js'

// Using environment variables for Supabase credentials
export const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '')
