import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { LinksFunction, MetaFunction } from '@remix-run/node'

import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Barlow&family=Barlow+Condensed:wght@400;700&family=Bellefair&display=swap',
  },
]

export const meta: MetaFunction = () => [
  { name: 'viewport', content: 'width=device-width, initial-scale=1', key: 'viewport' },
  { charSet: 'utf-8', key: 'charset' },
]

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-x-hidden">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
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
      <body className="h-full overflow-x-hidden">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Oops!</h1>
            <p className="mt-2 text-white">Something went wrong.</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
