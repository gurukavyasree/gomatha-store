import './globals.css';
import Link from 'next/link';
import { Sparkles, PhoneCall } from 'lucide-react';

export const metadata = {
  title: 'Gomatha Store - Pure Kanjivaram Sarees & Temple Jewellery',
  description: 'Handcrafted bridal sarees, heritage pure silks, and divine temple jewellery directly from skilled weavers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF7F2] text-stone-900 font-sans min-h-screen flex flex-col antialiased selection:bg-[#D4AF37]/30 selection:text-[#5E0817]">
        {/* Top Gold Ribbon */}
        <div className="bg-gradient-to-r from-[#821024] via-[#A82035] to-[#821024] text-[#F9E7B9] text-[11px] font-medium text-center py-2 px-4 tracking-wider border-b border-[#D4AF37]/30 shadow-inner flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>Direct Orders &amp; WhatsApp Video Call Assistance Available</span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline font-semibold text-white">100% Authentic Handpicked Quality</span>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/70 shadow-sm transition-all">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-[0.15em] text-[#6B0B19] uppercase font-serif drop-shadow-sm group-hover:text-[#8E1025] transition-colors">
                  GOMATHA
                </span>
                <span className="bg-[#6B0B19] text-[#F9E7B9] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  STORE
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-serif tracking-[0.25em] text-[#9A7514] font-medium">
                Sarees &bull; Jewellery &bull; Heritage
              </span>
            </Link>

            {/* Navigation & Admin Action */}
            <div className="flex items-center gap-4 sm:gap-8">
              <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold tracking-wide">
                <Link
                  href="/#sarees"
                  className="text-stone-700 hover:text-[#6B0B19] relative transition py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
                >
                  Sarees
                </Link>
                <Link
                  href="/#jewellery"
                  className="text-stone-700 hover:text-[#6B0B19] relative transition py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
                >
                  Jewellery
                </Link>
              </nav>

              {/* Mobile Upload Button */}
              <Link
                href="/admin"
                className="bg-gradient-to-r from-[#6B0B19] to-[#8E1025] hover:from-[#560914] hover:to-[#720C1D] text-[#FBF5E5] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg border border-[#D4AF37]/40 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>+ Upload</span>
                <span className="hidden sm:inline">from Mobile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-[#1C1517] text-stone-400 text-xs border-t-2 border-[#D4AF37]/30 pt-10 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold tracking-widest text-[#F9E7B9] uppercase">
                Gomatha Store
              </h3>
              <p className="text-stone-400 text-xs max-w-md mx-auto">
                Bringing the timeless grace of handcrafted silks and traditional jewellery straight to your home.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-[#D4AF37]/90 font-medium">
              <span>✓ Verified Quality</span>
              <span>✓ WhatsApp Confirmation</span>
              <span>✓ Direct Weaver Pricing</span>
            </div>

            <p className="text-stone-500 text-[11px] pt-4 border-t border-stone-800">
              © {new Date().getFullYear()} Gomatha Store. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
