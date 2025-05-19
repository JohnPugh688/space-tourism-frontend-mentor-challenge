import React, { useState } from 'react'
import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from '@remix-run/react'
import OptimizedBackground from '~/components/shared/OptimizedBackground'
import { getTechnology } from '~/utils/data.server'
import type { Technology } from '~/types/technology'

export const meta: MetaFunction = () => [
  { title: 'Space Tourism - Technology', key: 'title' },
  { name: 'description', content: 'Learn about space technology', key: 'description' },
]

export async function loader() {
  try {
    const technology = getTechnology()

    if (!technology || technology.length === 0) {
      throw new Response('Technology data not found', { status: 404 })
    }

    return json({ technology })
  } catch (error) {
    console.error('Error loading technology data:', error)
    throw new Response('Error loading technology data', { status: 500 })
  }
}

export default function TechnologyPage() {
  const { technology: techItems } = useLoaderData<typeof loader>()
  const [currentTechIndex, setCurrentTechIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayedTech, setDisplayedTech] = useState(techItems[0])
  const [imageError, setImageError] = useState({ landscape: false, portrait: false })

  const handleTechChange = (index: number) => {
    if (index === currentTechIndex) return

    setIsTransitioning(true)
    setImageError({ landscape: false, portrait: false })

    // Wait for fade out
    setTimeout(() => {
      setCurrentTechIndex(index)
      setDisplayedTech(techItems[index])

      // Start fade in
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  const handleLandscapeImageError = () => {
    setImageError((prev) => ({ ...prev, landscape: true }))
  }

  const handlePortraitImageError = () => {
    setImageError((prev) => ({ ...prev, portrait: true }))
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: '/technology/background-technology-mobile.webp',
            fallback: '/technology/background-technology-mobile.jpg',
          }}
          tabletImage={{
            webp: '/technology/background-technology-tablet.webp',
            fallback: '/technology/background-technology-tablet.jpg',
          }}
          desktopImage={{
            webp: '/technology/background-technology-desktop.webp',
            fallback: '/technology/background-technology-desktop.jpg',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat mix-blend-screen opacity-25"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen mx-auto max-w-[108rem] pt-24 md:pt-36 lg:pt-48">
        {/* Page Title */}
        <header className="px-6 md:px-10 lg:px-[166.5px]">
          <h1 className="flex items-center justify-center md:justify-start font-barlow-condensed text-base md:text-xl lg:text-[28px] tracking-[2.7px] md:tracking-[3.375px] lg:tracking-[4.725px]">
            <span className="font-bold text-white opacity-25 mr-4 lg:mr-[54px]">03</span>
            <span className="text-white uppercase">SPACE LAUNCH 101</span>
          </h1>
        </header>

        {/* Mobile/Tablet Image */}
        <section className="block lg:hidden w-full mt-8 md:mt-14" aria-label="Technology Image - Mobile View">
          {!imageError.landscape ? (
            <picture>
              <source srcSet={displayedTech.images.landscapeWebp} type="image/webp" />
              <img
                src={displayedTech.images.landscape}
                alt={displayedTech.name}
                onError={handleLandscapeImageError}
                className={`w-full md:h-[400px] object-cover object-center transition-opacity duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </picture>
          ) : (
            <div
              className={`w-full h-[170px] md:h-[400px] flex items-center justify-center text-white bg-[#38394f]/40 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="text-center p-4">Image not available</p>
            </div>
          )}
        </section>

        <div className="lg:flex lg:items-start lg:gap-20 lg:pl-[165px] lg:pr-0 lg:mt-[90px]">
          {/* Numbers Navigation */}
          <nav
            className="flex justify-center lg:justify-start mt-8 md:mt-14 lg:mt-0"
            aria-label="Technology Navigation"
          >
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-8">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTechChange(index)}
                  aria-label={`View ${techItems[index].name}`}
                  aria-current={index === currentTechIndex ? 'page' : undefined}
                  className={`w-10 h-10 md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] 
                    rounded-full border cursor-pointer flex items-center justify-center
                    transition-colors duration-300 ease-in-out
                    ${
                      index === currentTechIndex
                        ? 'bg-white text-[#0B0D17] border-white'
                        : 'text-white border-white/25 hover:border-white hover:bg-white/10'
                    }
                    focus:outline-none focus:ring-2 focus:ring-white/50
                    active:bg-white active:text-[#0B0D17]`}
                >
                  <span className="font-bellefair text-base md:text-2xl lg:text-[32px] leading-none lg:leading-[37px]">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content Section */}
          <article className="text-center lg:text-left mt-8 md:mt-11 lg:mt-0 max-w-[327px] md:max-w-[458px] lg:max-w-[470px] mx-auto lg:mx-0 px-6 lg:px-0 lg:flex-1">
            <div
              className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <p className="font-barlow-condensed text-sm md:text-base lg:text-[16px] tracking-[2.36px] md:tracking-[2.7px] text-[#D0D6F9]">
                THE TERMINOLOGY...
              </p>

              <h2 className="font-bellefair text-2xl md:text-[40px] lg:text-[56px] text-white uppercase mt-2 md:mt-3 lg:mt-4">
                {displayedTech.name}
              </h2>

              <p className="font-barlow text-[15px] md:text-base lg:text-[18px] leading-6 md:leading-7 lg:leading-[32px] text-[#D0D6F9] mt-4">
                {displayedTech.description}
              </p>
            </div>
          </article>

          {/* Desktop Image */}
          <section className="hidden lg:block lg:flex-1 lg:max-w-[50%]" aria-label="Technology Image - Desktop View">
            {!imageError.portrait ? (
              <picture>
                <source srcSet={displayedTech.images.portraitWebp} type="image/webp" />
                <img
                  src={displayedTech.images.portrait}
                  alt={displayedTech.name}
                  onError={handlePortraitImageError}
                  className={`w-full max-w-[34.375rem] h-[527px] object-cover object-center transition-opacity duration-300 ease-in-out ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </picture>
            ) : (
              <div
                className={`w-full max-w-[34.375rem] h-[527px] flex items-center justify-center text-white bg-[#38394f]/40 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <p className="text-center p-4">Image not available</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let heading = 'Something went wrong'
  let message = 'An unexpected error occurred. Please try again later.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      heading = 'Technology data not found'
      message = "Sorry, the technology information you're looking for doesn't exist."
    } else if (error.status === 500) {
      heading = 'Server error'
      message = 'There was a problem loading the technology data. Please try again later.'
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: '/technology/background-technology-mobile.webp',
            fallback: '/technology/background-technology-mobile.jpg',
          }}
          tabletImage={{
            webp: '/technology/background-technology-tablet.webp',
            fallback: '/technology/background-technology-tablet.jpg',
          }}
          desktopImage={{
            webp: '/technology/background-technology-desktop.webp',
            fallback: '/technology/background-technology-desktop.jpg',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat mix-blend-screen opacity-25"
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-24 md:pt-36 px-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-bellefair text-white text-3xl md:text-4xl mb-4">{heading}</h1>
          <p className="font-barlow text-[#D0D6F9] text-base md:text-lg mb-8">{message}</p>
          <Link
            to="/"
            className="inline-block font-barlow-condensed text-white text-base tracking-[2.7px] uppercase bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
