import React, { useState, useRef, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from '@remix-run/react'
import OptimizedBackground from '~/components/shared/OptimizedBackground'
import { getCrewMembers } from '~/utils/data.server'
import ErrorBoundaryComponent from '~/components/shared/ErrorBoundary'

export const meta: MetaFunction = () => [
  { title: 'Space Tourism - Crew', key: 'title' },
  { name: 'description', content: 'Meet your space crew', key: 'description' },
]

export async function loader() {
  try {
    // SUPABASE VERSION: getCrewMembers() now returns a Promise that resolves to an array of crew members
    // We need to await the result since we're getting data from a database now
    const crew = await getCrewMembers()

    // Check if we got valid data back
    if (!crew || crew.length === 0) {
      throw new Response('Crew data not found', { status: 404 })
    }

    return json({ crew })
  } catch (error) {
    console.error('Error loading crew data:', error)
    throw new Response('Error loading crew data', { status: 500 })
  }
}

export default function CrewPage() {
  // The data structure stays the same, but now it's coming from Supabase
  const { crew } = useLoaderData<typeof loader>()

  // Initialize state with first crew member (same as before)
  const [currentCrewIndex, setCurrentCrewIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Get the current crew member from the array
  const currentCrewMember = crew[currentCrewIndex]

  // The rest of the component remains the same
  const handleCrewChange = (index: number) => {
    if (index === currentCrewIndex) return
    const direction = index > currentCrewIndex ? 'left' : 'right'
    setSlideDirection(direction)
    setIsTransitioning(true)
    setImageError(false)
    setTimeout(() => {
      setCurrentCrewIndex(index)
      setIsTransitioning(false)
      setSlideDirection(null)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentCrewIndex < crew.length - 1) {
      handleCrewChange(currentCrewIndex + 1)
    }

    if (isRightSwipe && currentCrewIndex > 0) {
      handleCrewChange(currentCrewIndex - 1)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getSlideAnimation = () => {
    if (!slideDirection) return ''
    if (isTransitioning) {
      return slideDirection === 'left' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'
    }
    return 'translate-x-0 opacity-100'
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-[#0B0D17]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <OptimizedBackground
        mobileImage={{
          webp: '/crew/background-crew-mobile.webp',
          fallback: '/crew/background-crew-mobile.jpg',
        }}
        tabletImage={{
          webp: '/crew/background-crew-tablet.webp',
          fallback: '/crew/background-crew-tablet.jpg',
        }}
        desktopImage={{
          webp: '/crew/background-crew-desktop.webp',
          fallback: '/crew/background-crew-desktop.jpg',
        }}
        className="bg-cover bg-center bg-no-repeat min-h-screen opacity-25 mix-blend-screen"
      />

      {/* Main Content */}
      <div className="relative w-full mx-auto max-w-[108em] px-6 md:px-10 lg:px-40 pt-24 md:pt-36 lg:pt-48">
        {/* Page Title */}
        <header>
          <h1 className="font-barlow-condensed text-white text-center md:text-left mb-8 md:mb-14 lg:mb-0 lg:mt-[5.25rem]">
            <span className="font-bold opacity-25 mr-4 text-base md:text-xl lg:text-[28px] tracking-[2.7px] md:tracking-[3.38px] lg:tracking-[4.725px]">
              02
            </span>
            <span className="text-base md:text-xl lg:text-[28px] tracking-[2.7px] md:tracking-[3.38px] lg:tracking-[4.725px] uppercase">
              Meet your crew
            </span>
          </h1>
        </header>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-col lg:flex-row lg:items-end max-w-[1440px] mx-auto">
          {/* Content Section */}
          <article className="order-2 md:order-1 lg:order-1 text-center md:text-center lg:text-left lg:flex lg:flex-col lg:gap-12 lg:justify-between lg:h-full mt-8 md:mt-14 lg:mt-0">
            <div className={`transform transition-all duration-300 ease-in-out ${getSlideAnimation()}`}>
              {/* Role */}
              <h2 className="font-bellefair text-base md:text-[1.5rem] lg:text-[2rem] text-white opacity-50 uppercase mb-2 md:mb-4">
                {currentCrewMember.role}
              </h2>

              {/* Name */}
              <h3 className="font-bellefair text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem] text-white uppercase mb-4 md:mb-6">
                {currentCrewMember.name}
              </h3>

              {/* Bio */}
              <p className="font-barlow text-[0.9375rem] md:text-base lg:text-lg leading-[1.5625rem] font-extralight opacity-75 md:leading-[1.75rem] lg:leading-[2rem] text-[#D0D6F9] mb-8 max-w-[444px] md:max-w-[592px] lg:max-w-[444px] mx-auto lg:mx-0">
                {currentCrewMember.bio}
              </p>
            </div>

            {/* Navigation Dots */}
            <nav
              className="hidden md:flex gap-4 justify-center lg:justify-start lg:mt-auto h-full lg:mb-20 md:mt-10"
              aria-label="Crew member navigation"
            >
              {crew.map((member, index) => (
                <button
                  key={index}
                  onClick={() => handleCrewChange(index)}
                  className={`w-[0.9375rem] h-[0.9375rem] rounded-full transition-opacity cursor-pointer ${
                    index === currentCrewIndex ? 'bg-white' : 'bg-white opacity-[0.17] hover:opacity-50'
                  }`}
                  aria-label={`View ${member.name}, ${member.role}`}
                  aria-current={index === currentCrewIndex ? 'true' : 'false'}
                />
              ))}
            </nav>
          </article>

          {/* Image Section */}
          <figure className="w-full md:w-auto order-1 md:order-2 lg:order-2 lg:ml-auto">
            <div className="relative w-full flex flex-col md:block">
              <div className="relative w-full flex items-end justify-center">
                {!imageError ? (
                  <img
                    // Note: If your Supabase data structure is different from your original data,
                    // you might need to adjust these image paths
                    src={currentCrewMember.images.webp}
                    alt={`${currentCrewMember.name}, ${currentCrewMember.role}`}
                    onError={handleImageError}
                    className={`w-[20.4375rem] md:mt-10 md:w-[28.52313rem] lg:w-[35.50438rem] h-[13.875rem] md:h-[33rem] lg:h-[40.875rem] object-contain object-bottom transform transition-all duration-300 ease-in-out ${getSlideAnimation()}`}
                  />
                ) : (
                  <div
                    className={`w-[20.4375rem] md:mt-10 md:w-[28.52313rem] lg:w-[35.50438rem] h-[13.875rem] md:h-[33rem] lg:h-[40.875rem] flex items-center justify-center text-white bg-[#38394f]/40 rounded-lg transform transition-all duration-300 ease-in-out ${getSlideAnimation()}`}
                  >
                    <p className="text-center p-4">Image not available</p>
                  </div>
                )}
              </div>
              {/* Border line - Mobile Only */}
              <div className="md:hidden w-[20.4375rem] h-[0.0625rem] bg-[#383B4B] mx-auto" />
            </div>

            {/* Navigation Dots - Mobile Only */}
            <nav className="md:hidden flex gap-5 justify-center mt-8 mb-8" aria-label="Crew member navigation">
              {crew.map((member, index) => (
                <button
                  key={index}
                  onClick={() => handleCrewChange(index)}
                  className={`w-[0.625rem] h-[0.625rem] rounded-full transition-opacity cursor-pointer ${
                    index === currentCrewIndex ? 'bg-white' : 'bg-white opacity-[0.17] hover:opacity-50'
                  }`}
                  aria-label={`View ${member.name}, ${member.role}`}
                  aria-current={index === currentCrewIndex ? 'true' : 'false'}
                />
              ))}
            </nav>
          </figure>
        </div>
      </div>
    </main>
  )
}

export function ErrorBoundary() {
  return (
    <ErrorBoundaryComponent
      defaultHeading="Crew not found"
      defaultMessage="Sorry, the crew information you're looking for doesn't exist."
      backgroundImages={{
        mobile: {
          webp: '/crew/background-crew-mobile.webp',
          fallback: '/crew/background-crew-mobile.jpg',
        },
        tablet: {
          webp: '/crew/background-crew-tablet.webp',
          fallback: '/crew/background-crew-tablet.jpg',
        },
        desktop: {
          webp: '/crew/background-crew-desktop.webp',
          fallback: '/crew/background-crew-desktop.jpg',
        },
      }}
    />
  )
}
