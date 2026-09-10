import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Gomatha Store - Graceful Sarees & Divine Jewellery',
  description: 'Handcrafted sarees, pure silks, and temple jewellery curated directly for you.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FAF8F5] text-stone-900 font-sans min-h-screen flex flex-col antialiased">
        {/* Top Mustard Announcement Bar */}
        <div className="bg-[#C59B27] text-white text-[11px] font-medium text-center py-1.5 px-4 tracking-wide shadow-sm">
          ✨ Welcome to Gomatha Store — Direct Orders &amp; WhatsApp Assistance Available! ✨
        </div>

        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-[#801426] uppercase font-serif">
                GOMATHA
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#C59B27] tracking-wider uppercase font-sans">
                STORE
              </span>
            </Link>

            {/* Navigation Links & Action Button */}
            <div className="flex items-center gap-5 sm:gap-8">
              <nav className="flex items-center gap-5 sm:gap-6 text-sm font-medium text-stone-700">
                <Link href="/#sarees" className="hover:text-[#801426] transition-colors">
                  Sarees
                </Link>
                <Link href="/#jewellery" className="hover:text-[#801426] transition-colors">
                  Jewellery
                </Link>
              </nav>

              <Link
                href="/admin"
                className="bg-[#801426] hover:bg-[#670f1e] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150 shadow-sm whitespace-nowrap"
              >
                + Mobile Upload
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 text-center">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p className="font-medium text-stone-300">Gomatha Store</p>
            <p>© {new Date().getFullYear()} All rights reserved. Handcrafted Sarees &amp; Jewellery.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
