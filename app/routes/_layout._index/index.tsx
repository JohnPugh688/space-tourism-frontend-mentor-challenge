import React from 'react'
import type { MetaFunction } from '@remix-run/node'
import { isRouteErrorResponse, Link, useRouteError } from '@remix-run/react'
import OptimizedBackground from '~/components/shared/OptimizedBackground'

export const meta: MetaFunction = () => [
  { title: 'Space Tourism', key: 'title' },
  { name: 'description', content: 'Explore space with us', key: 'description' },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full overflow-hidden max-w-[100%]">
        {/* Background images - responsive */}
        <OptimizedBackground
          mobileImage={{
            webp: '/home/background-home-mobile.webp',
            fallback: '/home/background-home-mobile.jpg',
          }}
          tabletImage={{
            webp: '/home/background-home-tablet.webp',
            fallback: '/home/background-home-tablet.jpg',
          }}
          desktopImage={{
            webp: '/home/background-home-desktop.webp',
            fallback: '/home/background-home-desktop.jpg',
          }}
          className="bg-cover bg-center bg-no-repeat"
        />
      </div>

      {/* Content */}
      <div className="relative w-full mx-auto pt-[88px] md:pt-[202px] lg:pt-[23rem] max-w-[100%]">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-24 flex flex-col lg:flex-row items-center lg:items-end lg:justify-between">
          {/* Text content */}
          <article className="w-full max-w-[450px] text-center lg:text-left">
            <h1 className="font-barlow-condensed text-[#D0D6F9] text-sm sm:text-base md:text-xl lg:text-[28px] tracking-[2.7px] md:tracking-[3.38px] lg:tracking-[4.72px] uppercase">
              So, you want to travel to
              <span className="font-bellefair block text-white text-[50px] xs:text-[80px] md:text-[150px] leading-[60px] xs:leading-[100px] md:leading-[150px] mt-2 sm:mt-4 md:mt-6">
                Space
              </span>
            </h1>
            <p className="font-barlow text-[#D0D6F9] text-[13px] xs:text-[15px] md:text-base lg:text-[18px] leading-[22px] xs:leading-[25px] md:leading-[28px] lg:leading-[32px] mt-4 md:mt-6">
              Let's face it; if you want to go to space, you might as well genuinely go to outer space and not hover
              kind of on the edge of it. Well sit back, and relax because we'll give you a truly out of this world
              experience!
            </p>
          </article>

          {/* Explore button */}
          <div className="mt-8 sm:mt-20 md:mt-32 lg:mt-0 lg:ml-auto">
            <Link to="/destination" className="group relative inline-block" aria-label="Explore space destinations">
              <div className="w-[120px] xs:w-[150px] md:w-[242px] lg:w-[274px] h-[120px] xs:h-[150px] md:h-[242px] lg:h-[274px] rounded-full bg-white flex items-center justify-center">
                <span className="font-bellefair text-[16px] xs:text-[20px] md:text-[32px] text-[#0B0D17] tracking-[2px] uppercase flex items-center justify-center text-center leading-none">
                  Explore
                </span>
              </div>
              {/* Hover effect */}
              <div
                className="absolute inset-0 rounded-full bg-white/10 
                transition-all duration-700 ease-out origin-center
                scale-0 group-hover:scale-[1.4]"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let heading = 'Houston, we have a problem'
  let message = 'An unexpected error occurred. Please try again later.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      heading = 'Page not found'
      message = "Sorry, the page you're looking for doesn't exist."
    } else if (error.status === 500) {
      heading = 'Server error'
      message = 'There was a problem loading this page. Please try again later.'
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0D17]">
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: '/home/background-home-mobile.webp',
            fallback: '/home/background-home-mobile.jpg',
          }}
          tabletImage={{
            webp: '/home/background-home-tablet.webp',
            fallback: '/home/background-home-tablet.jpg',
          }}
          desktopImage={{
            webp: '/home/background-home-desktop.webp',
            fallback: '/home/background-home-desktop.jpg',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen"
        />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-bellefair text-white text-4xl md:text-6xl mb-6">{heading}</h1>
          <p className="font-barlow text-[#D0D6F9] text-base md:text-lg mb-12">{message}</p>
          <Link
            to="/"
            className="inline-block font-barlow-condensed text-white text-base tracking-[2.7px] uppercase bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
