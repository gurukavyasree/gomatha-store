'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Star, Heart, MapPin, Truck, ThumbsUp, Send,
  Trash2, X, MessageCircle, ShoppingBag
} from 'lucide-react';

export default function GomathaStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal / PDP State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [pincode, setPincode] = useState('515001');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Update with your WhatsApp number (Country code + 10 digits, no '+')
  const whatsappNumber = '910000000000';

  useEffect(() => {
    async function loadStoreItems() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStoreItems();
  }, []);

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setReviewsLoading(false);
    }
  };

  const openProductDetail = (prod) => {
    setSelectedProduct(prod);
    const firstImg = prod.images?.[0] || prod.image_url;
    setSelectedImage(firstImg);
    setSelectedSize('Free Size');
    fetchReviews(prod.id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          customer_name: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post review');
      setReviews([data.review, ...reviews]);
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err.message);
    }
  };

  const buildWhatsAppBuyUrl = (prod) => {
    const text = encodeURIComponent(
      `Hello Gomatha Store! \n\nI want to order this product:\n*${prod.title}*\nPrice: ₹${prod.price}\nCategory: ${prod.category}\nSelected Size: ${selectedSize}\nPincode: ${pincode}\nProduct Link: ${typeof window !== 'undefined' ? window.location.origin : ''}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  // Curated categories with matching Meesho-style round badges
  const visualCategories = [
    { title: 'Sarees', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&q=80' },
    { title: 'Jewellery', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80' },
    { title: 'Dresses', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80' },
    { title: 'Bags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80' },
    { title: 'Cosmetics', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80' },
    { title: 'Home Decor', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80' },
    { title: 'Gifts', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&q=80' },
    { title: 'Fancy Items', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80' },
  ];

  const displayedProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
      {/* 1. Round Category Badges */}
      <section className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-stone-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max gap-6 sm:gap-8">
          <div
            onClick={() => setActiveCategory('All')}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 flex items-center justify-center bg-stone-50 ${activeCategory === 'All' ? 'border-[#9f2089]' : 'border-stone-200 group-hover:border-[#9f2089]'}`}>
              <span className="text-xs font-bold text-[#9f2089]">All Items</span>
            </div>
            <span className="text-xs font-medium text-stone-700">Explore All</span>
          </div>

          {visualCategories.map((c, i) => (
            <div
              key={i}
              onClick={() => setActiveCategory(c.title)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition ${activeCategory.toLowerCase() === c.title.toLowerCase() ? 'border-[#9f2089]' : 'border-transparent group-hover:border-[#9f2089]'}`}>
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-300"
                />
              </div>
              <span className={`text-xs font-medium ${activeCategory.toLowerCase() === c.title.toLowerCase() ? 'text-[#9f2089] font-bold' : 'text-stone-700 group-hover:text-[#9f2089]'}`}>
                {c.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Meesho-Style Promo Banner */}
      <section className="bg-gradient-to-r from-[#9f2089] via-[#b3279c] to-[#791568] rounded-xl p-6 sm:p-10 mb-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2.5 max-w-lg text-center sm:text-left">
          <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Lowest Wholesale Prices
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Gomatha Mega Collection
          </h1>
          <p className="text-xs sm:text-sm text-pink-100">
            Handpicked Sarees, Temple Jewellery, Bags, Cosmetics, Home Decor & Fancy Gifts with Direct WhatsApp Ordering.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex-shrink-0">
          <Truck className="w-8 h-8 text-pink-200" />
          <div className="text-left text-xs">
            <p className="font-bold">Free Delivery</p>
            <p className="text-pink-100 text-[11px]">Direct Weaver & Factory Pricing</p>
          </div>
        </div>
      </section>

      {/* 3. Product Catalog Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {activeCategory === 'All' ? 'Products For You' : `${activeCategory} Collection`}
            </h2>
            <p className="text-xs text-stone-500">Showing {displayedProducts.length} verified products</p>
          </div>
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs text-[#9f2089] font-semibold hover:underline"
            >
              Reset to All
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm animate-pulse">
            Loading products...
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-sm font-bold text-stone-700">No items uploaded under "{activeCategory}".</p>
            <Link href="/admin" className="text-xs text-[#9f2089] font-semibold mt-2 inline-block">
              + Upload to this category via Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayedProducts.map((p) => {
              const origPrice = Math.round(Number(p.price) * 1.5);
              const discountPct = Math.round(((origPrice - p.price) / origPrice) * 100);
              const img = (p.images && p.images[0]) || p.image_url;

              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p)}
                  className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
                >
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-stone-500 hover:text-[#9f2089]">
                      <Heart className="w-4 h-4" />
                    </button>
                    {!p.in_stock && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#9f2089]">
                        {p.category}
                      </span>
                      <h3 className="text-xs text-stone-700 font-normal line-clamp-1 group-hover:text-[#9f2089] transition">
                        {p.title}
                      </h3>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-stone-900">
                          ₹{p.price}
                        </span>
                        <span className="text-[11px] text-stone-400 line-through">
                          ₹{origPrice}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                          {discountPct}% off
                        </span>
                      </div>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium inline-block mt-1">
                        Free Delivery
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                      <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        4.3 <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {p.in_stock ? `Qty: ${p.stock_quantity ?? 1}` : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Full-Screen Detail Modal (PDP) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex justify-center items-start sm:items-center p-0 sm:p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#f8f9fa] w-full max-w-5xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                gomatha &bull; {selectedProduct.category}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-stone-400 hover:text-stone-800 p-1.5 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Images */}
              <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-3">
                {selectedProduct.images?.length > 1 && (
                  <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px]">
                    {selectedProduct.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`w-14 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition ${
                          selectedImage === imgUrl ? 'border-[#9f2089]' : 'border-stone-200 opacity-70'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex-1 aspect-[3/4] bg-white rounded-lg border border-stone-200 overflow-hidden relative group">
                  <img
                    src={selectedImage || selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain cursor-zoom-in hover:scale-110 transition duration-300"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2">
                  <span className="bg-pink-100 text-[#9f2089] text-[10px] font-bold px-2 py-0.5 rounded">
                    Gomatha Mall Verified
                  </span>
                  <h1 className="text-base sm:text-lg font-bold text-stone-800">
                    {selectedProduct.title}
                  </h1>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-stone-900">
                      ₹{selectedProduct.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{Math.round(Number(selectedProduct.price) * 1.5)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">33% off</span>
                  </div>
                </div>

                {/* Size Pills */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-stone-700 block uppercase">
                    Select Size / Variant
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Free Size', 'Standard', 'S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition ${
                          selectedSize === sz
                            ? 'border-[#9f2089] bg-pink-50 text-[#9f2089]'
                            : 'border-stone-300 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1 text-xs">
                    <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                      Product Details
                    </h4>
                    <p className="text-stone-600 leading-relaxed pt-1">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Delivery Checker */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase">
                    Check Delivery Pincode
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter Delivery Pincode"
                      className="border border-stone-300 px-3 py-2 text-xs rounded-md focus:outline-none focus:border-[#9f2089]"
                    />
                    <button
                      onClick={() => setPincodeChecked(true)}
                      className="text-xs font-bold text-[#9f2089] px-4 py-2 hover:bg-pink-50 rounded-md border border-[#9f2089]"
                    >
                      CHECK
                    </button>
                  </div>
                  {pincodeChecked && (
                    <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Free Delivery available for <strong>{pincode}</strong></span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center justify-center gap-2 border-2 border-[#9f2089] text-[#9f2089] font-bold py-3 rounded-lg hover:bg-pink-50 text-xs sm:text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Price Summary</span>
                  </button>
                  <a
                    href={buildWhatsAppBuyUrl(selectedProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#9f2089] hover:bg-[#851871] text-white font-bold py-3 rounded-lg text-xs sm:text-sm shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Buy on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Ratings & Customer Reviews Section */}
            <div className="bg-white border-t border-stone-200 p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-base text-stone-900 border-b border-stone-200 pb-3">
                Customer Reviews & Ratings
              </h3>

              <form onSubmit={handleReviewSubmit} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-700">Write a Review</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500 mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setReviewRating(s)}
                      className="p-0.5 text-amber-400"
                    >
                      <Star className={`w-4 h-4 ${s <= reviewRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="border border-stone-300 p-2 text-xs rounded bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Feedback on quality, fabric, or design..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="border border-stone-300 p-2 text-xs rounded bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#9f2089] text-white text-xs font-bold px-4 py-2 rounded hover:bg-[#851871] transition flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              <div className="divide-y divide-stone-100">
                {reviewsLoading ? (
                  <p className="text-xs text-stone-400 py-4">Loading customer feedback...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-4">No reviews yet. Be the first to share one!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="py-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">{rev.customer_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {rev.rating} <Star className="w-2.5 h-2.5 fill-white" />
                          </span>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-stone-300 hover:text-red-500 p-1"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Checkout / Price Summary Drawer */}
      {showCheckout && selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCheckout(false)}
        >
          <div
            className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#f8f9fa] border-b border-stone-200 p-4 flex items-center justify-between">
              <span className="text-lg font-black text-[#9f2089] lowercase">gomatha</span>
              <button onClick={() => setShowCheckout(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3 bg-stone-50 p-3 rounded-lg">
                <img
                  src={selectedImage || selectedProduct.image_url}
                  alt=""
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{selectedProduct.title}</h4>
                  <p className="text-xs font-black text-[#9f2089] mt-1">₹{selectedProduct.price}</p>
                  <p className="text-[11px] text-stone-500">Size: {selectedSize} | Qty: 1</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-y border-stone-200 py-3">
                <div className="flex justify-between">
                  <span>Product Price</span>
                  <span>₹{Math.round(Number(selectedProduct.price) * 1.5)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount</span>
                  <span>- ₹{Math.round(Number(selectedProduct.price) * 0.5)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Delivery Charges</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-stone-100 text-stone-900">
                  <span>Final Total</span>
                  <span>₹{selectedProduct.price}</span>
                </div>
              </div>

              <a
                href={buildWhatsAppBuyUrl(selectedProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#9f2089] hover:bg-[#851871] text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                Proceed to WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
