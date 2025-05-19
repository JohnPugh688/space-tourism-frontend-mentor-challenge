import { useState } from 'react'
import { json } from '@remix-run/node'
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'
import { getDestinations } from '~/utils/data.server'
import OptimizedImage from '~/components/shared/OptimizedImage'
import OptimizedBackground from '~/components/shared/OptimizedBackground'

export const meta: MetaFunction = () => [
  { title: 'Space Tourism - Destination', key: 'title' },
  { name: 'description', content: 'Choose your destination in space', key: 'description' },
]

export async function loader() {
  try {
    const destinations = getDestinations()

    if (!destinations || destinations.length === 0) {
      throw new Response('Destination data not found', { status: 404 })
    }

    return json({ destinations })
  } catch (error) {
    console.error('Error loading destination data:', error)
    throw new Response('Error loading destination data', { status: 500 })
  }
}

export default function DestinationPage() {
  const { destinations } = useLoaderData<typeof loader>()
  const [currentDestination, setCurrentDestination] = useState(destinations[0])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleDestinationChange = (destination: (typeof destinations)[0]) => {
    if (destination.name === currentDestination.name) return
    setIsTransitioning(true)
    setImageError(false)
    setTimeout(() => {
      setCurrentDestination(destination)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Background images - responsive */}
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: '/destination/background-destination-mobile.webp',
            fallback: '/destination/background-destination-mobile.jpg',
          }}
          tabletImage={{
            webp: '/destination/background-destination-tablet.webp',
            fallback: '/destination/background-destination-tablet.jpg',
          }}
          desktopImage={{
            webp: '/destination/background-destination-desktop.webp',
            fallback: '/destination/background-destination-desktop.jpg',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-16 lg:px-24 xl:px-40 pt-[88px] md:pt-[136px] lg:pt-[180px] xl:pt-[212px] transition-all duration-300">
        {/* Page Title */}
        <header>
          <h1 className="font-barlow-condensed text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] tracking-[2.7px] md:tracking-[3.38px] lg:tracking-[4.72px] uppercase transition-all duration-300">
            <span className="font-bold opacity-25 mr-4">01</span>
            Pick your destination
          </h1>
        </header>

        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between transition-all duration-300">
          {/* Planet Image */}
          <figure className="w-[170px] sm:w-[220px] md:w-[300px] lg:w-[380px] xl:w-[445px] aspect-square transition-all duration-300">
            {!imageError ? (
              <OptimizedImage
                webpSrc={currentDestination.images.webp}
                fallbackSrc={currentDestination.images.png}
                alt={`${currentDestination.name} planet`}
                onError={handleImageError}
                className={`w-full h-full object-contain animate-planet-spin transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                priority={true}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-white bg-[#38394f]/40 rounded-full ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <p className="text-center p-4">Image not available</p>
              </div>
            )}
          </figure>

          {/* Content */}
          <article className="mt-6 sm:mt-8 md:mt-10 lg:mt-0 max-w-[327px] sm:max-w-[375px] md:max-w-[445px] transition-all duration-300">
            {/* Navigation */}
            <nav aria-label="Destination navigation">
              <ul className="flex justify-center lg:justify-start gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 transition-all duration-300">
                {destinations.map((destination) => (
                  <li key={destination.name}>
                    <button
                      onClick={() => handleDestinationChange(destination)}
                      className={`font-barlow-condensed text-sm sm:text-[15px] md:text-base tracking-[2.36px] md:tracking-[2.7px] pb-2 border-b-[3px] transition-all duration-300 cursor-pointer
                        ${
                          currentDestination.name === destination.name
                            ? 'text-white border-white'
                            : 'text-[#D0D6F9] border-transparent hover:border-white/50'
                        }`}
                      aria-current={currentDestination.name === destination.name ? 'true' : 'false'}
                    >
                      {destination.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Destination Info */}
            <div
              className={`mt-8 text-center lg:text-left transition-all duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <h2 className="font-bellefair text-[40px] sm:text-[56px] md:text-[80px] lg:text-[90px] xl:text-[100px] text-white uppercase transition-all duration-300">
                {currentDestination.name}
              </h2>
              <p className="mt-4 md:mt-6 font-barlow text-[15px] md:text-base lg:text-[18px] leading-[25px] md:leading-[28px] lg:leading-[32px] text-[#D0D6F9] transition-all duration-300">
                {currentDestination.description}
              </p>

              {/* Divider */}
              <hr className="mt-8 md:mt-12 h-[1px] bg-[#383B4B] border-0" />

              {/* Stats */}
              <dl className="mt-8 md:mt-7 flex flex-col md:flex-row items-center md:justify-center lg:justify-start gap-8 md:gap-16 lg:gap-20 xl:gap-24 transition-all duration-300">
                <div>
                  <dt className="font-barlow-condensed text-sm tracking-[2.36px] text-[#D0D6F9] uppercase">
                    Avg. Distance
                  </dt>
                  <dd className="mt-3 font-bellefair text-[28px] text-white uppercase">
                    {currentDestination.distance}
                  </dd>
                </div>
                <div>
                  <dt className="font-barlow-condensed text-sm tracking-[2.36px] text-[#D0D6F9] uppercase">
                    Est. Travel Time
                  </dt>
                  <dd className="mt-3 font-bellefair text-[28px] text-white uppercase">{currentDestination.travel}</dd>
                </div>
              </dl>
            </div>
          </article>
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
      heading = 'Destinations not found'
      message = "Sorry, the destination information you're looking for doesn't exist."
    } else if (error.status === 500) {
      heading = 'Server error'
      message = 'There was a problem loading the destination data. Please try again later.'
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: '/destination/background-destination-mobile.webp',
            fallback: '/destination/background-destination-mobile.jpg',
          }}
          tabletImage={{
            webp: '/destination/background-destination-tablet.webp',
            fallback: '/destination/background-destination-tablet.jpg',
          }}
          desktopImage={{
            webp: '/destination/background-destination-desktop.webp',
            fallback: '/destination/background-destination-desktop.jpg',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen"
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
