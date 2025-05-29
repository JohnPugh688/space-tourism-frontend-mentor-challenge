import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import { LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { createServerSupabase } from './utils/supabase'

import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
  },
]

// Add all future flags configuration
export const future = {
  v3_fetcherPersist: true,
  v3_lazyRouteDiscovery: true,
  v3_relativeSplatPath: true,
  v3_singleFetch: true,
  v3_throwAbortReason: true,
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Space Tourism' },
    { name: 'description', content: 'Explore the cosmos with our space tourism experience' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createServerSupabase(request)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return {
    session,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data?.env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

// Handle errors gracefully
export function ErrorBoundary() {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Error - Space Tourism</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full overflow-x-hidden">
        <AuthProvider>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Oops!</h1>
              <p className="mt-2 text-white">Something went wrong.</p>
            </div>
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
