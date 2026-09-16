'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, Sparkles, ChevronLeft, ChevronRight, 
  X, Maximize2, Star, Send, MessageSquare, Trash2 
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

  // WhatsApp business number (include country code, without + or spaces)
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
      `Hello Gomatha Store! I would like to order this item:\n\n*${product.title}*\nPrice: ₹${product.price}\nCategory: ${product.category}\nItem Link: ${product.images?.[0] || product.image_url}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

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
      if (distance > 45) {
        setCurrentIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
      } else if (distance < -45) {
        setCurrentIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
      }
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition group">
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
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />

          <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category}
          </span>

          {imageList.length > 1 && (
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
          )}

          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">{product.title}</h3>
            {product.description && (
              <p className="text-xs text-stone-500 line-clamp-2 mt-1">{product.description}</p>
            )}

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
              <button disabled className="bg-stone-200 text-stone-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
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
              <h2 className="text-xl font-bold font-serif text-stone-900">Sarees ({sarees.length})</h2>
            </div>
            {sarees.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No sarees uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {sarees.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>

          {/* Jewellery Section */}
          <section id="jewellery" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
              <h2 className="text-xl font-bold font-serif text-stone-900">Jewellery ({jewellery.length})</h2>
            </div>
            {jewellery.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No jewellery uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {jewellery.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>

          {/* Combos Section */}
          {combos.length > 0 && (
            <section id="combos" className="scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#C59B27]" />
                <h2 className="text-xl font-bold font-serif text-stone-900">Combos ({combos.length})</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
                {combos.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Fullscreen Modal: High-Res Zoom & Customer Reviews */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between overflow-y-auto backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalProduct(null)}
        >
          {/* Top Bar */}
          <div className="p-4 flex items-center justify-between text-white border-b border-stone-800" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-bold text-sm sm:text-base">{activeModalProduct.title}</h3>
              <p className="text-xs text-[#C59B27]">
                ₹{Number(activeModalProduct.price).toLocaleString('en-IN')} • {activeModalProduct.category}
              </p>
            </div>
            <button
              onClick={() => setActiveModalProduct(null)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Zoomable Container */}
          <div
            className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative cursor-zoom-in max-w-full overflow-hidden"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={modalImages[modalImageIndex]}
                alt="Product Zoomed"
                className={`max-h-[60vh] object-contain rounded-lg transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                }`}
              />
            </div>

            <p className="absolute bottom-2 text-[11px] text-stone-400 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
              {isZoomed ? 'Tap to Zoom Out' : 'Tap photo to Zoom In (Amazon Style)'}
            </p>

            {modalImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails & WhatsApp Button */}
          <div className="px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 overflow-x-auto max-w-full">
              {modalImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsZoomed(false);
                    setModalImageIndex(i);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    i === modalImageIndex ? 'border-[#C59B27]' : 'border-transparent opacity-60'
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition"
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

          {/* Customer Reviews Section */}
          <div className="bg-[#FAF8F5] text-stone-900 p-4 sm:p-6 rounded-t-3xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#801426]" />
                  <h4 className="font-bold text-base text-stone-900">Customer Reviews ({reviews.length})</h4>
                </div>
              </div>

              {/* Review Input Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600">Write a Review</h5>
                
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-600 mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Ananya)"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Share fabric quality, shine, zari details..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full bg-[#801426] hover:bg-[#670f1e] text-white text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  {reviewSubmitting ? 'Posting Review...' : 'Submit Review'}
                </button>
              </form>

              {/* Reviews List with Delete Button */}
              <div className="space-y-3">
                {reviewsLoading ? (
                  <p className="text-xs text-stone-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No reviews yet for this product. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-stone-100 shadow-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">{rev.customer_name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600">{rev.comment}</p>
                      <span className="text-[10px] text-stone-400 block pt-1">
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
