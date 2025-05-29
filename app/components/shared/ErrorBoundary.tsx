import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import OptimizedBackground from './OptimizedBackground'

interface ErrorBoundaryProps {
  defaultHeading?: string
  defaultMessage?: string
  backgroundImages?: {
    mobile: {
      webp: string
      fallback: string
    }
    tablet: {
      webp: string
      fallback: string
    }
    desktop: {
      webp: string
      fallback: string
    }
  }
}

export default function ErrorBoundaryComponent({
  defaultHeading = 'Something went wrong',
  defaultMessage = 'An unexpected error occurred. Please try again later.',
  backgroundImages = {
    mobile: {
      webp: '/home/background-home-mobile.webp',
      fallback: '/home/background-home-mobile.jpg',
    },
    tablet: {
      webp: '/home/background-home-tablet.webp',
      fallback: '/home/background-home-tablet.jpg',
    },
    desktop: {
      webp: '/home/background-home-desktop.webp',
      fallback: '/home/background-home-desktop.jpg',
    },
  },
}: ErrorBoundaryProps) {
  const error = useRouteError()

  let heading = defaultHeading
  let message = defaultMessage

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      heading = 'Not found'
      message = "Sorry, the information you're looking for doesn't exist."
    } else if (error.status === 500) {
      heading = 'Server error'
      message = 'There was a problem loading the data. Please try again later.'
    } else if (error.status === 403) {
      heading = 'Access denied'
      message = "You don't have permission to access this resource."
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0D17]">
      <div className="fixed inset-0 z-0">
        <OptimizedBackground
          mobileImage={{
            webp: backgroundImages.mobile.webp,
            fallback: backgroundImages.mobile.fallback,
          }}
          tabletImage={{
            webp: backgroundImages.tablet.webp,
            fallback: backgroundImages.tablet.fallback,
          }}
          desktopImage={{
            webp: backgroundImages.desktop.webp,
            fallback: backgroundImages.desktop.fallback,
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen"
        />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-bellefair text-white text-3xl md:text-5xl mb-6">{heading}</h1>
          <p className="font-barlow text-[#D0D6F9] text-base md:text-lg mb-10">{message}</p>
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
