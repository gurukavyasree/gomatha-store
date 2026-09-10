import './globals.css';

export const metadata = {
  title: 'Gomatha Store | Traditional Sarees & Exquisite Jewellery',
  description: 'Handcrafted sarees and fine jewellery collections at Gomatha Store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top Gold Bar */}
        <div className="bg-gold-600 text-black text-xs font-semibold py-1.5 px-4 text-center tracking-wide">
          ✨ Welcome to Gomatha Store — Direct Orders & WhatsApp Assistance Available! ✨
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-serif font-bold text-maroon-800 tracking-tight">
              GOMATHA <span className="text-gold-600 font-sans text-lg font-medium">STORE</span>
            </a>
            
            <nav className="flex items-center space-x-6">
              <a href="#sarees" className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition">
                Sarees
              </a>
              <a href="#jewellery" className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition">
                Jewellery
              </a>
              <a 
                href="/admin" 
                className="bg-maroon-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-maroon-900 transition"
              >
                + Mobile Upload
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-300 py-8 border-t border-stone-800 mt-12 text-center text-sm">
          <p>© {new Date().getFullYear()} Gomatha Store. All rights reserved.</p>
          <p className="text-xs text-stone-500 mt-1">Authentic Silks, Cottons, & Traditional Ornaments</p>
        </footer>
      </body>
    </html>
  );
}
