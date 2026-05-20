import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cormorant_Garamond, Raleway } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const _raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Serenity Rejuvenation",
  description: "Serenity Rejuvenation - Hydration Spa for Restore, Rebalance, and Renew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-neutral-950 text-neutral-50">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
