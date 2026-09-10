import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Gomatha Store - Pure Sarees & Jewellery',
  description: 'Handpicked Sarees & Elegant Jewellery Collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 font-sans min-h-screen flex flex-col">
        {/* Top Announcement Bar */}
        <div className="bg-amber-600 text-white text-[11px] font-medium text-center py-1.5 px-4 tracking-wide">
          ✨ Welcome to Gomatha Store — Direct Orders & WhatsApp Assistance Available! ✨
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-red-950 uppercase font-serif">
                GOMATHA <span className="text-amber-600 text-sm font-sans tracking-normal">STORE</span>
              </span>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-stone-700">
              <Link href="/?category=All" className="hover:text-red-950 transition">
                All
              </Link>
              <Link href="/?category=Sarees" className="hover:text-red-950 transition">
                Sarees
              </Link>
              <Link href="/?category=Jewellery" className="hover:text-red-950 transition">
                Jewellery
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 text-center">
          <p>© {new Date().getFullYear()} Gomatha Store. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
