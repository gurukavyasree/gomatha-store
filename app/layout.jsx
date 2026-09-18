import './globals.css';
import Link from 'next/link';
import { Search, User, ShoppingCart, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'Gomatha Lowest Prices, Best Quality Sarees, Jewellery & Gifts',
  description: 'Shop sarees, home decor, gifts, cosmetics, bags, dresses, jewellery & fancy items at wholesale prices on Gomatha.',
};

export default function RootLayout({ children }) {
  const categories = [
    'All',
    'Sarees',
    'Jewellery',
    'Dresses',
    'Bags',
    'Cosmetics',
    'Home Decor',
    'Gifts',
    'Fancy Items',
  ];

  return (
    <html lang="en">
      <body className="bg-[#f8f9fa] text-stone-800 antialiased selection:bg-[#9f2089]/20 selection:text-[#9f2089]">
        {/* Main Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1 flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#9f2089] lowercase font-sans">
                gomatha
              </span>
            </Link>

            {/* Meesho-Style Search Bar */}
            <div className="flex-1 max-w-xl relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Try Sarees, Jewellery, Cosmetics, Bags, or Gifts"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 hover:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#9f2089] transition"
              />
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-4 sm:gap-7 text-stone-700 text-xs font-medium">
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 hover:text-[#9f2089] transition font-semibold"
              >
                <Smartphone className="w-4 h-4 text-[#9f2089]" />
                <span>Supplier / Upload</span>
              </Link>
              <div className="h-6 w-px bg-stone-200 hidden md:block" />
              <button className="flex flex-col items-center gap-0.5 hover:text-[#9f2089] transition">
                <User className="w-5 h-5 text-stone-600" />
                <span className="text-[11px]">Profile</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 hover:text-[#9f2089] transition relative">
                <ShoppingCart className="w-5 h-5 text-stone-600" />
                <span className="text-[11px]">Cart</span>
                <span className="absolute -top-1 right-1 bg-[#9f2089] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-3 pb-2.5 sm:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Try Saree, Bags, Jewellery or Gifts"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <nav className="border-t border-stone-100 bg-white overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2.5 text-xs text-stone-700 whitespace-nowrap">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-[#9f2089] hover:font-semibold transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <div className="min-h-screen">{children}</div>

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 mt-16 py-10 text-stone-600 text-xs">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-xl font-black text-[#9f2089] lowercase">gomatha</span>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                India's top direct manufacturer destination for Sarees, Jewellery, Bags, Cosmetics, Home Decor & Fancy collections at lowest prices.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 mb-2">Shop Categories</h4>
              <ul className="space-y-1.5 text-stone-500">
                <li>Sarees & Dresses</li>
                <li>Temple & Fashion Jewellery</li>
                <li>Cosmetics & Bags</li>
                <li>Home Decor & Fancy Gifts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 mb-2">Shopping Guarantees</h4>
              <ul className="space-y-1.5 text-stone-500">
                <li>7 Days Easy Exchange</li>
                <li>Cash On Delivery (COD)</li>
                <li>WhatsApp Order Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 mb-2">Admin Portal</h4>
              <p className="text-stone-500 text-[11px]">Upload images and track catalog inventory.</p>
              <Link href="/admin" className="text-[#9f2089] font-bold mt-2 inline-block">
                Admin Panel &rarr;
              </Link>
            </div>
          </div>
          <p className="text-center text-stone-400 text-[11px] pt-8 mt-8 border-t border-stone-100">
            &copy; {new Date().getFullYear()} gomatha. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
