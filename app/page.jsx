'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, Sparkles, ChevronLeft, ChevronRight, 
  X, Maximize2, Star, Send, MessageSquare, Trash2,
  ShieldCheck, Truck, RefreshCw, Eye
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fullscreen Modal / Zoom / Review State
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Update this with your WhatsApp business number (country code + number, no '+' or spaces)
  const whatsappNumber = '6302787575';

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

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleOpenModal = (product, initialIdx = 0) => {
    setActiveModalProduct(product);
    setModalImageIndex(initialIdx);
    setIsZoomed(false);
    fetchReviews(product.id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalProduct) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: activeModalProduct.id,
          customer_name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setReviews([data.review, ...reviews]);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      alert(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Do you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete review');

      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err.message);
    }
  };

  const sarees = products.filter((item) => item.category?.toLowerCase() === 'sarees');
  const jewellery = products.filter((item) => item.category?.toLowerCase() === 'jewellery');
  const combos = products.filter((item) => item.category?.toLowerCase() === 'combos');

  const buildWhatsAppUrl = (product) => {
    const text = encodeURIComponent(
      `Namaste Gomatha Store! 🙏\n\nI want to order this item:\n*${product.title}*\nPrice: ₹${Number(product.price).toLocaleString('en-IN')}\nCategory: ${product.category}\nProduct Link: ${product.images?.[0] || product.image_url}\n\nPlease share payment details and availability!`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  // Product Card with Touch Swipe, Discount MRP Tag, and Stock urgency
  const ProductCard = ({ product }) => {
    const imageList = product.images?.length > 0 ? product.images : [product.image_url];
    const [currentIdx, setCurrentIdx] = useState(0);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
      touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 40) {
        setCurrentIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
      } else if (distance < -40) {
        setCurrentIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
      }
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    // Calculate approximate original price to show a discount tag
    const originalPrice = Math.round(Number(product.price) * 1.35);

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EBE3D5] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(107,11,25,0.12)] hover:border-[#D4AF37]/50 transition-all duration-300 group">
        {/* Image Box */}
        <div
          className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden cursor-pointer select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleOpenModal(product, currentIdx)}
        >
          <img
            src={imageList[currentIdx]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />

          {/* Zoom hint badge */}
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full opacity-80 group-hover:opacity-100 hover:scale-110 transition shadow">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 bg-[#6B0B19]/90 backdrop-blur-md text-[#F9E7B9] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#D4AF37]/40 shadow-sm">
            {product.category}
          </span>

          {/* Swipe indicator dots */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
              {imageList.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all shadow ${
                    i === currentIdx ? 'w-5 bg-[#F9E7B9]' : 'w-1.5 bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Out of stock banner */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
              <span className="bg-[#8E1025] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider shadow-lg border border-red-400/40">
                Currently Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-[#6B0B19] transition-colors line-clamp-1">
              {product.title}
            </h3>

            {product.description && (
              <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Urgency / Stock badge */}
            <div className="mt-2.5 flex items-center gap-2">
              {product.in_stock ? (
                product.stock_quantity && product.stock_quantity <= 3 ? (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60">
                    ⚡ Only {product.stock_quantity} left!
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Available in Stock
                  </span>
                )
              ) : (
                <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  Restocking Soon
                </span>
              )}
            </div>
          </div>

          {/* Price & Action Button */}
          <div className="pt-2.5 border-t border-stone-100 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-[#6B0B19]">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 block">
                Save 25% Off
              </span>
            </div>

            {product.in_stock ? (
              <a
                href={buildWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#128C7E]" />
                <span>Buy</span>
              </a>
            ) : (
              <button disabled className="bg-stone-200 text-stone-400 text-xs font-medium px-3 py-1.5 rounded-xl cursor-not-allowed">
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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* Luxury Royal Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5A0713] via-[#750D1D] to-[#3D030C] text-[#FAF6F0] p-6 sm:p-12 shadow-xl border border-[#D4AF37]/30">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 backdrop-blur-md px-3 py-1 rounded-full text-[#F9E7B9] text-xs font-semibold border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pure Handcrafted Elegance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FBF5E5] leading-[1.15] drop-shadow">
            Graceful Sarees &amp; Divine Jewellery
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-lg">
            Immerse yourself in authentic weaves, rich Kanchipuram zari, and sacred temple jewellery curated for celebrations and weddings.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#sarees"
              className="bg-[#D4AF37] hover:bg-[#B38728] text-[#3D030C] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              Explore Sarees
            </a>
            <a
              href="#jewellery"
              className="bg-white/10 hover:bg-white/20 text-[#FAF6F0] border border-white/20 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full backdrop-blur-sm transition"
            >
              Temple Jewellery
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Trust & Guarantee Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE8DA] flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[#6B0B19] flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">100% Authentic</h4>
            <p className="text-[10px] text-stone-500">Pure silk &amp; quality test</p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE8DA] flex items-center gap-3 shadow-sm">
          <Truck className="w-6 h-6 text-[#6B0B19] flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Safe Delivery</h4>
            <p className="text-[10px] text-stone-500">Secure doorstep dispatch</p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE8DA] flex items-center gap-3 shadow-sm">
          <MessageCircle className="w-6 h-6 text-[#6B0B19] flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Direct Support</h4>
            <p className="text-[10px] text-stone-500">Order on WhatsApp</p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE8DA] flex items-center gap-3 shadow-sm">
          <RefreshCw className="w-6 h-6 text-[#6B0B19] flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Weaver Direct</h4>
            <p className="text-[10px] text-stone-500">No middleman markups</p>
          </div>
        </div>
      </section>

      {/* Toolbar / Live Count */}
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            Exclusive Handpicked Catalog
          </h2>
          <p className="text-xs text-stone-500">{products.length} exclusive creations active right now</p>
        </div>
        <Link
          href="/admin"
          className="bg-[#FAF7F2] hover:bg-white text-[#6B0B19] border border-[#6B0B19]/30 text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-sm"
        >
          Manage Inventory
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400 text-sm animate-pulse">
          Loading handcrafted catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-500 text-sm bg-white rounded-3xl border border-[#E8DFC8] p-8">
          <p className="font-serif font-bold text-lg text-[#6B0B19] mb-1">Catalog is getting updated!</p>
          <p className="text-xs text-stone-400 mb-4">Tap below to snap and add your very first collection item.</p>
          <Link
            href="/admin"
            className="inline-block bg-[#6B0B19] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow"
          >
            + Snap Photo from Mobile
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Sarees Section */}
          <section id="sarees" className="scroll-mt-24">
            <div className="flex items-end justify-between mb-5 border-b border-[#E8DFC8]/60 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#6B0B19]/10 flex items-center justify-center text-[#6B0B19]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    Handloom Sarees Collection
                  </h2>
                  <p className="text-xs text-stone-500">Pure silks, kanchi borders &amp; festive drapes</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#6B0B19] bg-[#6B0B19]/10 px-2.5 py-1 rounded-full">
                {sarees.length} Styles
              </span>
            </div>

            {sarees.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6">No sarees uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {sarees.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>

          {/* Jewellery Section */}
          <section id="jewellery" className="scroll-mt-24">
            <div className="flex items-end justify-between mb-5 border-b border-[#E8DFC8]/60 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#6B0B19]/10 flex items-center justify-center text-[#6B0B19]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    Divine Temple Jewellery
                  </h2>
                  <p className="text-xs text-stone-500">Intricate nakshi, harams, bangles &amp; chokers</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#6B0B19] bg-[#6B0B19]/10 px-2.5 py-1 rounded-full">
                {jewellery.length} Designs
              </span>
            </div>

            {jewellery.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6">No jewellery items uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {jewellery.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>

          {/* Combos Section */}
          {combos.length > 0 && (
            <section id="combos" className="scroll-mt-24">
              <div className="flex items-end justify-between mb-5 border-b border-[#E8DFC8]/60 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#6B0B19]/10 flex items-center justify-center text-[#6B0B19]">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                      Matching Saree &amp; Jewellery Sets
                    </h2>
                    <p className="text-xs text-stone-500">Perfect matching bridal combos</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#6B0B19] bg-[#6B0B19]/10 px-2.5 py-1 rounded-full">
                  {combos.length} Combos
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {combos.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Meesho / Amazon Style Interactive Modal with Pinch Zoom & Customer Feedback */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-fade-in"
          onClick={() => setActiveModalProduct(null)}
        >
          {/* Header Bar */}
          <div className="p-4 flex items-center justify-between text-white border-b border-stone-800 bg-stone-950/80 sticky top-0 z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#F9E7B9]">
                {activeModalProduct.title}
              </h3>
              <p className="text-xs text-stone-300">
                ₹{Number(activeModalProduct.price).toLocaleString('en-IN')} &bull; {activeModalProduct.category}
              </p>
            </div>
            <button
              onClick={() => setActiveModalProduct(null)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Zoom Display Stage */}
          <div
            className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative cursor-zoom-in max-w-full overflow-hidden select-none"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={modalImages[modalImageIndex]}
                alt="Zoomed Detail"
                className={`max-h-[62vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                }`}
              />
            </div>

            <p className="absolute bottom-3 text-[11px] text-stone-300 bg-black/75 px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm border border-white/10">
              {isZoomed ? 'Tap to Zoom Out' : 'Tap on photo to inspect fabric weave & zari closely'}
            </p>

            {modalImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Selector Strip & Primary WhatsApp Button */}
          <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950/90 border-t border-stone-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 overflow-x-auto max-w-full py-1">
              {modalImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex(i);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    i === modalImageIndex ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {activeModalProduct.in_stock ? (
              <a
                href={buildWhatsAppUrl(activeModalProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#128C7E]" />
                Direct Order on WhatsApp
              </a>
            ) : (
              <span className="text-xs font-semibold text-red-300 bg-red-950/80 px-4 py-2 rounded-xl border border-red-800/80">
                Item Sold Out
              </span>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#FAF7F2] text-stone-900 p-5 sm:p-8 rounded-t-3xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#6B0B19]" />
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Verified Customer Reviews ({reviews.length})
                  </h4>
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#E8DFC8] space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#6B0B19]">
                  Share Your Experience
                </h5>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600 mr-2">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Lavanya)"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B0B19] bg-stone-50/50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mention color, shine, fabric softness..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B0B19] bg-stone-50/50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full bg-[#6B0B19] hover:bg-[#850D20] text-[#F9E7B9] text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  {reviewSubmitting ? 'Submitting...' : 'Post Customer Review'}
                </button>
              </form>

              {/* Reviews List with Delete Button */}
              <div className="space-y-3">
                {reviewsLoading ? (
                  <p className="text-xs text-stone-400 py-4 text-center">Loading customer feedback...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-4 text-center">
                    No reviews yet for this product. Be the first to share your review!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-4 rounded-xl border border-[#E8DFC8]/60 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{rev.customer_name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-stone-300 hover:text-red-600 p-1 transition"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-stone-400 block">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
