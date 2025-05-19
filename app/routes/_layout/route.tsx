import { Outlet, useLocation, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
import Header from '~/components/header/header'
import MobileMenu from '~/components/header/header-components/mobile-menu'

// Placeholder imports for shared components and providers
// Replace these with your actual components as you build them
// import Header from '~/components/Header';
// import Footer from '~/components/Footer';
// import { ModalProvider } from '~/context/modal-context';
// import { CartProvider } from '~/context/cart-context';
// import SideCart from '~/components/header-components/side-cart';
// import GlobalProductModal from '~/components/global-product-modal';
// import CartButton from '../_layout._index/components/cart-button';

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
    // Uncomment and use providers as you implement them
    // <CartProvider>
    //   <ModalProvider>
    <div className="relative min-h-screen w-full bg-[#0B0D17] overflow-x-hidden">
      <Header isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Page content with transition */}
      <main className="relative min-h-[calc(100vh-96px)]">
        {/* Keep the old page visible until the new one is ready */}
        <div className="relative w-full h-full">
          <div
            key={location.pathname}
            className={`w-full h-full transition-opacity duration-500 ease-in-out absolute inset-0
              ${navigation.state === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
    //   </ModalProvider>
    // </CartProvider>
  )
}
