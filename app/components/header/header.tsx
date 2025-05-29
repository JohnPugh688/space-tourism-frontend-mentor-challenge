import { NavLink } from 'react-router';
import { useState } from 'react'
import Logo from './header-components/logo'
import AuthModal from '../auth/AuthModal'
import { useAuth } from '~/context/AuthContext'

const publicNavItems = [
  { to: '/', number: '00', label: 'HOME' },
  { to: '/destination', number: '01', label: 'DESTINATION' },
  { to: '/crew', number: '02', label: 'CREW' },
  { to: '/technology', number: '03', label: 'TECHNOLOGY' },
]

interface HeaderProps {
  isMobileMenuOpen: boolean
  onMobileMenuToggle: (isOpen: boolean) => void
}

export default function Header({ isMobileMenuOpen, onMobileMenuToggle }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  const navItems = [
    ...publicNavItems,
    ...(user ? [{ to: '/mission-control', number: '04', label: 'MISSION CONTROL' }] : []),
  ]

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50">
        {/* Auth buttons - above main header */}
        <div className="flex justify-end px-6 py-2 bg-black/40 backdrop-blur-md">
          {!loading && (
            <>
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="text-amber-400 hover:text-amber-300 font-barlow-condensed tracking-[2.7px] text-sm transition-colors"
                >
                  SIGN OUT
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-barlow-condensed tracking-[2.7px] text-sm transition-colors"
                >
                  LOGIN / SIGN UP
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 md:px-0 md:pl-6 py-4 md:py-0 lg:py-8">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Horizontal line - Desktop only */}
          <div className="hidden lg:block h-[1px] bg-amber-500/25 flex-1 ml-16 mr-[-2rem] z-20" />

          {/* Desktop Navigation */}
          <nav className="hidden md:block backdrop-blur-md bg-black/40 px-6 lg:px-[123px]">
            <ul className="flex gap-4 lg:gap-12 h-24 items-center">
              {navItems.map((item) => (
                <li key={item.to} className="relative group h-full flex items-center">
                  <NavLink
                    to={item.to}
                    prefetch="intent"
                    className={({ isActive }) =>
                      `flex items-center gap-2 lg:gap-3 font-barlow-condensed text-white text-sm lg:text-base tracking-[2.36px] lg:tracking-[2.7px] h-full
                      ${
                        isActive
                          ? 'border-b-[3px] border-amber-400'
                          : 'border-b-[3px] border-transparent hover:border-amber-400/50'
                      }`
                    }
                    end={item.to === '/'}
                  >
                    <span className="font-bold text-amber-400 hidden lg:inline">{item.number}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              className="size-8 text-white flex items-center justify-center z-50"
              onClick={() => onMobileMenuToggle(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 21">
                <g fill="#D0D6F9" fillRule="evenodd">
                  <path d="M0 0h24v3H0zM0 9h24v3H0zM0 18h24v3H0z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
