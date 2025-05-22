import { Outlet, useLocation, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
import Header from '~/components/header/header'
import MobileMenu from '~/components/header/header-components/mobile-menu'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigation = useNavigation()

  // Close mobile menu on navigation state change
  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsMobileMenuOpen(false)
    }
  }, [navigation.state])

  // Force viewport to use actual device width
  useEffect(() => {
    // Force viewport meta tag to use actual device width
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover'

    // Remove any existing viewport meta tags and add our new one
    document.querySelectorAll('meta[name="viewport"]').forEach((el) => el.remove())
    document.head.appendChild(meta)

    // Try to prevent any default scaling
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      @viewport {
        width: device-width;
        zoom: 1.0;
      }
      
      html, body {
        min-width: initial !important;
        min-height: initial !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        width: 100% !important;
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      styleElement.remove()
    }
  }, [])

  return (
    <div className="relative min-h-svh w-full max-w-[100vw] bg-[#0B0D17] overflow-x-hidden">
      <Header isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Page content with transition */}
      <div className="relative min-h-[calc(100svh-96px)] w-full max-w-[100vw]">
        {/* Keep the old page visible until the new one is ready */}
        <div className="relative w-full max-w-[100vw] h-full">
          <div
            key={location.pathname}
            className={`w-full max-w-[100vw] h-full transition-opacity duration-500 ease-in-out absolute inset-0
              ${navigation.state === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
