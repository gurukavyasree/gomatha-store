'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles, X, ZoomIn } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Update with your WhatsApp business number with country code (e.g. 919876543210)
  const whatsappNumber = '910000000000';

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Prevent background scrolling when image zoom modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProduct]);

  const sarees = products.filter(
    (item) => item.category?.toLowerCase() === 'sarees'
  );
  const jewellery = products.filter(
    (item) => item.category?.toLowerCase() === 'jewellery'
  );
  const combos = products.filter(
    (item) => item.category?.toLowerCase() === 'combos'
  );

  const buildWhatsAppUrl = (product) => {
    const text = encodeURIComponent(
      `Hello Gomatha Store! I would like to order this item:\n\n*${product.title}*\nPrice: ₹${product.price}\nView Item: ${product.image_url}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  const renderCard = (product) => (
    <div
      key={product.id}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow group"
    >
      {/* Clickable Image Box */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-3">
        <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-[#801426] transition-colors">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-1">{product.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-base font-bold text-[#801426]">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Order
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Headline */}
      <section className="text-center space-y-3 pt-4 pb-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#801426] tracking-tight">
          Graceful Sarees &amp; Divine Jewellery
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
          Handcrafted sarees, pure silks, and temple jewellery curated directly for you.
        </p>
      </section>

      {/* Subheader Toolbar */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <h2 className="text-sm sm:text-base font-semibold text-stone-800">
          Current Collection ({products.length})
        </h2>
        <Link
          href="/admin"
          className="bg-[#801426] hover:bg-[#670f1e] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition"
        >
          + Upload from Mobile
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400 text-sm">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-400 text-sm">
          No products listed yet. Tap <strong>+ Upload from Mobile</strong> to publish your first item!
        </div>
      ) : (
        <div className="space-y-14">
          {/* Sarees Section */}
          <section id="sarees" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Sarees ({sarees.length})
              </h2>
            </div>
            {sarees.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No sarees uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {sarees.map(renderCard)}
              </div>
            )}
          </section>

          {/* Jewellery Section */}
          <section id="jewellery" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Jewellery ({jewellery.length})
              </h2>
            </div>
            {jewellery.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No jewellery uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {jewellery.map(renderCard)}
              </div>
            )}
          </section>

          {/* Combos Section */}
          {combos.length > 0 && (
            <section id="combos" className="scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#C59B27]" />
                <h2 className="text-xl font-bold font-serif text-stone-900">
                  Combos ({combos.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {combos.map(renderCard)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Meesho/Amazon Style Fullscreen Image Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedProduct(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 text-white hover:text-stone-300 bg-black/40 hover:bg-black/70 p-2 rounded-full transition z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Expanded Image */}
            <div className="relative w-full flex-1 bg-stone-100 min-h-[300px] max-h-[65vh] flex items-center justify-center overflow-hidden">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Product Quick Details & Action Bar */}
            <div className="p-4 sm:p-5 bg-white flex flex-col gap-3 border-t border-stone-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-[#C59B27] uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {selectedProduct.title}
                  </h3>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-lg sm:text-xl font-black text-[#801426]">
                    ₹{Number(selectedProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {selectedProduct.description && (
                <p className="text-xs text-stone-600 leading-relaxed max-h-20 overflow-y-auto">
                  {selectedProduct.description}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <a
                  href={buildWhatsAppUrl(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </a>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-3 border border-stone-300 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
