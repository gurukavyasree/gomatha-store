'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Full-screen modal / Zoom preview state
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Put your WhatsApp number here
  const whatsappNumber = '910000000000';

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const sarees = products.filter((item) => item.category?.toLowerCase() === 'sarees');
  const jewellery = products.filter((item) => item.category?.toLowerCase() === 'jewellery');
  const combos = products.filter((item) => item.category?.toLowerCase() === 'combos');

  const buildWhatsAppUrl = (product) => {
    const text = encodeURIComponent(
      `Hello Gomatha Store! I would like to order this item:\n\n*${product.title}*\nPrice: ₹${product.price}\nCategory: ${product.category}\nItem Link: ${product.images?.[0] || product.image_url}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  // Product Card with Multi-Image Slide
  const ProductCard = ({ product }) => {
    const imageList = (product.images && product.images.length > 0)
      ? product.images
      : [product.image_url];

    const [currentIdx, setCurrentIdx] = useState(0);

    const prevSlide = (e) => {
      e.stopPropagation();
      setCurrentIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const nextSlide = (e) => {
      e.stopPropagation();
      setCurrentIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    const openZoom = () => {
      setActiveModalProduct(product);
      setModalImageIndex(currentIdx);
    };

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition group">
        {/* Image Slider Box */}
        <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={openZoom}>
          <img
            src={imageList[currentIdx]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Amazon/Meesho Zoom hint */}
          <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          {/* Category Tag */}
          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category}
          </span>

          {/* Slider Arrows (if > 1 image) */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-1 rounded-full shadow transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-1 rounded-full shadow transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                {imageList.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Out of Stock Overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">{product.title}</h3>
            {product.description && (
              <p className="text-xs text-stone-500 line-clamp-2 mt-1">{product.description}</p>
            )}

            {/* Stock quantity badge */}
            <div className="mt-2">
              {product.in_stock ? (
                product.stock_quantity && product.stock_quantity <= 3 ? (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Only {product.stock_quantity} left in stock!
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-emerald-700">
                    Available: {product.stock_quantity || 1}
                  </span>
                )
              ) : (
                <span className="text-[11px] font-semibold text-red-600">Currently Sold Out</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-base font-bold text-[#801426]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            {product.in_stock ? (
              <a
                href={buildWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Order
              </a>
            ) : (
              <button
                disabled
                className="bg-stone-200 text-stone-400 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const modalImages = activeModalProduct
    ? (activeModalProduct.images?.length > 0 ? activeModalProduct.images : [activeModalProduct.image_url])
    : [];

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

      {/* Toolbar */}
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
                {sarees.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
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
                {jewellery.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
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
                {combos.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Full-Screen Meesho / Amazon Style Lightbox Zoom Modal */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalProduct(null)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-bold text-sm sm:text-base">{activeModalProduct.title}</h3>
              <p className="text-xs text-[#C59B27] font-semibold">
                ₹{Number(activeModalProduct.price).toLocaleString('en-IN')}
                {activeModalProduct.in_stock ? ` • ${activeModalProduct.stock_quantity || 1} in stock` : ' • Out of Stock'}
              </p>
            </div>
            <button
              onClick={() => setActiveModalProduct(null)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Zoomable Image Center Stage */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImages[modalImageIndex]}
              alt="Zoomed product view"
              className="max-h-[75vh] max-w-full object-contain cursor-zoom-in rounded-lg shadow-2xl transition duration-200"
            />

            {modalImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setModalImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setModalImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails & Order Button */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800 pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-full py-1">
              {modalImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setModalImageIndex(i)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    i === modalImageIndex ? 'border-[#C59B27]' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Direct WhatsApp Action */}
            {activeModalProduct.in_stock ? (
              <a
                href={buildWhatsAppUrl(activeModalProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>
            ) : (
              <span className="text-xs font-semibold text-red-400 bg-red-950/50 px-4 py-2 rounded-lg border border-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
