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

  return (
    <div className="relative min-h-screen w-full min-w-[320px] bg-[#0B0D17] overflow-x-hidden">
      <Header isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Page content with transition */}
      <div className="relative min-h-[calc(100vh-96px)] w-full min-w-[320px]">
        {/* Keep the old page visible until the new one is ready */}
        <div className="relative w-full min-w-[320px] h-full">
          <div
            key={location.pathname}
            className={`w-full min-w-[320px] h-full transition-opacity duration-500 ease-in-out absolute inset-0
              ${navigation.state === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
