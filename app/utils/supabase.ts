import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

const isServer = typeof window === 'undefined'

const supabaseUrl = isServer ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = isServer ? process.env.VITE_SUPABASE_ANON_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: isServer
      ? undefined
      : {
          getItem: (key) => {
            try {
              const itemStr = window.localStorage.getItem(key)
              if (!itemStr) return null

              const item = JSON.parse(itemStr)
              const now = new Date()

              if (item.expiresAt && now.getTime() > item.expiresAt) {
                window.localStorage.removeItem(key)
                return null
              }

              return item.value
            } catch {
              return null
            }
          },
          setItem: (key, value) => {
            const item = {
              value,
              expiresAt: new Date().getTime() + 12 * 60 * 60 * 1000, // 12 hours
            }
            window.localStorage.setItem(key, JSON.stringify(item))
          },
          removeItem: (key) => window.localStorage.removeItem(key),
        },
  },
})

// Parse cookies helper
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=').map((part) => part.trim())
    if (parts.length === 2) {
      const [key, value] = parts
      cookies[key] = decodeURIComponent(value)
    }
  })
  return cookies
}

// Create a helper to get server-side supabase client with cookies
export const createServerSupabase = (request: Request) => {
  const cookies: string[] = []
  const cookieStore = parseCookies(request.headers.get('Cookie'))

  // Check if we're in development
  const isDevelopment = process.env.NODE_ENV === 'development'

  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    cookies: {
      get: (key) => {
        const value = cookieStore[key] || ''
        console.log(`Getting cookie ${key}:`, value ? '[FOUND]' : '[NOT FOUND]')
        return value
      },
      set: (key, value, options: CookieOptions = {}) => {
        console.log(`Setting cookie ${key}`)
        const cookie = [`${key}=${encodeURIComponent(value)}`, `Max-Age=${options.maxAge || 31536000}`, 'Path=/']

        // Only add HttpOnly and Secure in production
        if (!isDevelopment) {
          cookie.push('HttpOnly')
          cookie.push('Secure')
        }

        cookie.push('SameSite=Lax')

        if (options.domain) cookie.push(`Domain=${options.domain}`)
        cookies.push(cookie.join('; '))
      },
      remove: (key, options: CookieOptions = {}) => {
        console.log(`Removing cookie ${key}`)
        const cookie = [`${key}=`, 'Max-Age=0', 'Path=/']

        // Only add HttpOnly and Secure in production
        if (!isDevelopment) {
          cookie.push('HttpOnly')
          cookie.push('Secure')
        }

        cookie.push('SameSite=Lax')

        if (options.domain) cookie.push(`Domain=${options.domain}`)
        cookies.push(cookie.join('; '))
      },
    },
  })

  ;(client as any).cookies = cookies
  return client
}
