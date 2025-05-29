import { redirect, type LoaderFunctionArgs } from 'react-router';
import { createServerSupabase } from '~/utils/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  if (code) {
    console.log('Auth Callback - Received code, exchanging for session')
    const supabase = createServerSupabase(request)

    // Exchange the code for a session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return redirect(`/?error=auth`)
    }

    if (!session) {
      console.error('No session received after code exchange')
      return redirect(`/?error=auth`)
    }

    console.log('Auth Callback - Session exchange successful:', {
      userId: session.user.id,
      email: session.user.email,
    })

    // Get the cookies from the Supabase client
    const cookieStore = (supabase as any).cookies as string[]
    const headers = new Headers()

    // Add each cookie to the response headers
    if (cookieStore?.length) {
      console.log('Auth Callback - Setting cookies:', cookieStore.length)
      cookieStore.forEach((cookie) => {
        headers.append('Set-Cookie', cookie)
      })
    } else {
      console.warn('Auth Callback - No cookies to set after session exchange')
    }

    // Redirect to the next page or home with the cookies
    return redirect(next, {
      headers,
    })
  }

  console.log('Auth Callback - No code provided')
  return redirect(next)
}
