'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Place your WhatsApp business number with country code (e.g. 919876543210)
  const whatsappNumber = '6302787575';

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
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">{product.title}</h3>
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

          {/* Combos Section (if any uploaded) */}
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
    </main>
  );
}
