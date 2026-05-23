import { Music } from 'lucide-react'
import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Appointment Heading */}
      <div className="border-t border-gray-700 py-8 text-center">
        <p className="text-sm tracking-widest text-gray-300">
          SCHEDULE YOUR APPOINTMENT TODAY
        </p>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div>
              <h3 className="font-serif text-3xl lg:text-4xl text-white mb-4">
              Serenity Rejuvenation
              </h3>
              <p className="text-xs tracking-widest text-gray-400 mb-4">
                AESTHETICS & WELLNESS
              </p>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Unleash Your Inner Radiance
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Enhance your natural beauty with our customized aesthetic treatments.
              </p>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-sm tracking-widest text-[#d2b48c] font-semibold mb-6">
                CONTACT US
              </h4>
              <p className="text-sm text-gray-300 mb-6">
                (404) 446-9566
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#d2b48c] hover:text-white transition-colors">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="text-[#d2b48c] hover:text-white transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-[#d2b48c] hover:text-white transition-colors">
                  <Music size={20} />
                </a>
              </div>
            </div>

            {/* Hours Column */}
            <div>
              <h4 className="text-sm tracking-widest text-[#d2b48c] font-semibold mb-6">
                WORKING HOURS
              </h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Monday to Thursday: 8:30 AM–4:30 PM</p>
                <p>Friday: 8:30 AM–1:00 PM</p>
                <p>Saturday: by appointment only</p>
              </div>
            </div>

            {/* Location Column */}
            <div>
              <h4 className="text-sm tracking-widest text-[#d2b48c] font-semibold mb-6">
                LOCATION
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                371 E. Paces Ferry Rd. Suite 551,<br />
                Atlanta, GA 30305
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>
            ©2026 Serenity Rejuvenation Aesthetics and Wellness | All Rights Reserved | Privacy Policy
          </p>
          <p>
            Site Developed and Maintained By <Link href="https://devkins.dev" target='_blank' className='text-blue-500 underline'>Devkins.dev</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
