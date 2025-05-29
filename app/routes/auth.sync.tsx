// app/routes/auth.sync.tsx - Updated to properly set server session

import { type ActionFunctionArgs } from 'react-router'
import { createServerSupabase } from '~/utils/supabase'

export async function action({ request }: ActionFunctionArgs) {
  const supabase = createServerSupabase(request)

  try {
    let body
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      body = await request.json()
    } else {
      const text = await request.text()
      console.log('Auth sync received:', text.substring(0, 100) + '...')

      if (text.includes('event=')) {
        const params = new URLSearchParams(text)
        body = {
          event: params.get('event'),
          session: params.get('session') ? JSON.parse(decodeURIComponent(params.get('session') as string)) : null,
        }
      } else {
        body = JSON.parse(text)
      }
    }

    const { event, session } = body

    if (event === 'SIGNED_IN' && session) {
      console.log('User signed in:', session.user.email)

      // Set the session on the server-side client
      const { error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })

      if (error) {
        console.error('Error setting server session:', error)
        return { success: false, error: 'Failed to set server session' }
      }

      console.log('Server session set successfully')
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
      await supabase.auth.signOut()
    }

    // Get the cookies that were set and return them in headers
    const cookies = (supabase as any).cookies as string[]
    const headers = new Headers()

    if (cookies && cookies.length > 0) {
      console.log('Setting cookies in response:', cookies.length)
      cookies.forEach((cookie) => {
        headers.append('Set-Cookie', cookie)
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(headers.entries()),
      },
    })
  } catch (error) {
    console.error('Auth sync error:', error)
    return { success: false, error: 'Failed to sync auth state' }
  }
}
