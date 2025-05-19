import { NavLink, useNavigation } from '@remix-run/react'
import { useEffect } from 'react'

const navItems = [
  { to: '/', number: '00', label: 'HOME' },
  { to: '/destination', number: '01', label: 'DESTINATION' },
  { to: '/crew', number: '02', label: 'CREW' },
  { to: '/technology', number: '03', label: 'TECHNOLOGY' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigation = useNavigation()

  // Close menu when navigation starts
  useEffect(() => {
    if (navigation.state === 'loading') {
      onClose()
    }
  }, [navigation.state, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300
        ${!isOpen ? 'pointer-events-none invisible' : 'visible'}`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Menu panel */}
      <div
        className={`fixed inset-y-0 right-0 w-[254px] transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full backdrop-blur-2xl bg-white/[0.04]">
          <div className="flex justify-end px-6 pt-8">
            <button
              onClick={onClose}
              className="text-white p-2 hover:opacity-80 transition-opacity"
              aria-label="Close menu"
            >
              <svg width="20" height="21" xmlns="http://www.w3.org/2000/svg">
                <g fill="#D0D6F9" fillRule="evenodd">
                  <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
                  <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
                </g>
              </svg>
            </button>
          </div>
          <nav className="mt-16">
            <ul className="flex flex-col gap-8 px-8">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    prefetch="intent"
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-barlow-condensed text-white text-base tracking-[2.7px] 
                      transition-colors duration-200
                      ${isActive ? 'text-white' : 'text-[#D0D6F9] hover:text-white'}`
                    }
                    end={item.to === '/'}
                  >
                    <span className="font-bold">{item.number}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
