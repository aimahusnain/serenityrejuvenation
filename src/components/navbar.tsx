'use client'

import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full top-0 z-50 font-text" style={{ backgroundColor: '#000000' }}>
      <div className="border-b" style={{ borderColor: '#d2b48c' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-20">
            {/* Left Navigation */}
            <div className="flex items-center gap-6 flex-1">
              <a href="/" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Home
              </a>
              
              <div className="relative group">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="text-xs font-medium tracking-wider uppercase flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap"
                  style={{ color: '#d2b48c' }}
                >
                  Services
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {/* Desktop Dropdown Menu */}
                <div className="absolute left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={{ backgroundColor: '#1a1a1a', borderTop: `2px solid #d2b48c` }}>
                  <a href="/services/facials" className="block px-4 py-3 text-xs hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                    Facials
                  </a>
                  <a href="/services/body" className="block px-4 py-3 text-xs border-t hover:opacity-80 transition-opacity" style={{ color: '#d2b48c', borderColor: '#333333' }}>
                    Body Treatments
                  </a>
                  <a href="/services/injectables" className="block px-4 py-3 text-xs border-t hover:opacity-80 transition-opacity" style={{ color: '#d2b48c', borderColor: '#333333' }}>
                    Injectables
                  </a>
                </div>
              </div>

              <a href="/about" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                About Us
              </a>

              <a href="/gallery" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Gallery
              </a>

              <a href="/payment-plans" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Payment Plans
              </a>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0 px-8 text-center border-l border-r" style={{ borderColor: '#d2b48c' }}>
              <h1 className="font-heading text-3xl tracking-widest leading-none" style={{ color: '#d2b48c' }}>
              Serenity Rejuvenation
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-text mt-1" style={{ color: '#d2b48c' }}>
                hydration spa
              </p>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center gap-6 flex-1 justify-end">
              <a href="/blogs" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Blogs
              </a>

              <a href="/reviews" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Reviews
              </a>

              <a href="/gift-cards" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Gift Cards
              </a>

              <a href="/contact" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Contact
              </a>

              <a href="/shop" className="text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#d2b48c' }}>
                Shop
              </a>

              {/* Divider */}
              <div style={{ borderLeft: '2px solid #d2b48c', height: '16px' }}></div>

              {/* Book Now Button */}
              <button
                className="text-xs font-medium tracking-wider uppercase px-6 py-2 rounded transition-colors duration-300 whitespace-nowrap"
                style={{ backgroundColor: '#d2b48c', color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a67b5b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d2b48c'}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              style={{ color: '#d2b48c' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Logo */}
            <div className="text-center flex-1">
              <h1 className="font-heading text-lg tracking-widest leading-none" style={{ color: '#d2b48c' }}>
              Serenity Rejuvenation
              </h1>
              <p className="text-[8px] tracking-widest uppercase font-text" style={{ color: '#d2b48c' }}>
                hydration spa
                </p>
            </div>

            {/* Mobile Book Now Button */}
            <button
              className="text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded transition-colors duration-300 whitespace-nowrap"
              style={{ backgroundColor: '#d2b48c', color: '#000000', fontSize: '10px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a67b5b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d2b48c'}
            >
              Book
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t" style={{ borderColor: '#d2b48c' }}>
              <a href="/" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Home
              </a>

              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full text-left px-4 py-2 text-xs font-medium tracking-wider uppercase flex items-center justify-between hover:opacity-80 transition-opacity"
                  style={{ color: '#d2b48c' }}
                >
                  Services
                  <ChevronDown className={`w-3 h-3 transform transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesOpen && (
                  <div style={{ backgroundColor: '#1a1a1a' }}>
                    <a href="/services/facials" className="block px-8 py-2 text-xs hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                      Facials
                    </a>
                    <a href="/services/body" className="block px-8 py-2 text-xs hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                      Body Treatments
                    </a>
                    <a href="/services/injectables" className="block px-8 py-2 text-xs hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                      Injectables
                    </a>
                  </div>
                )}
              </div>

              <a href="/about" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                About Us
              </a>

              <a href="/gallery" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Gallery
              </a>

              <a href="/payment-plans" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Payment Plans
              </a>

              <a href="/blogs" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Blogs
              </a>

              <a href="/reviews" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Reviews
              </a>

              <a href="/gift-cards" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Gift Cards
              </a>

              <a href="/contact" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Contact
              </a>

              <a href="/shop" className="block px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-80 transition-opacity" style={{ color: '#d2b48c' }}>
                Shop
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
