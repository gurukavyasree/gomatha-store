'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Star, ShieldCheck, Heart, Share2, 
  ChevronRight, MapPin, Truck, ThumbsUp, Send, 
  Trash2, X, MessageCircle, Check, ShoppingBag, Info
} from 'lucide-react';

export default function GomathaStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Product Detail Modal (PDP)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [pincode, setPincode] = useState('516360');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Checkout View State
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Review, 2: Payment

  // Reviews System
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // WhatsApp Contact (Enter your WhatsApp number without '+' or spaces)
  const whatsappNumber = '6302787575';

  useEffect(() => {
    async function loadStoreItems() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
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
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

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
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const buildWhatsAppBuyUrl = (prod) => {
    const text = encodeURIComponent(
      `Hello Gomatha Store! 🛍️\n\nI want to order this item:\n*${prod.title}*\nPrice: ₹${prod.price}\nSelected Size: ${selectedSize}\nDelivery Address Pincode: ${pincode}\nItem Image: ${selectedImage || prod.image_url}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  // Visual Category Bubbles
  const circularCategories = [
    { title: 'Ethnic Wear', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80' },
    { title: 'Sarees', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&q=80' },
    { title: 'Jewellery', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80' },
    { title: 'Bridal Sets', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80' },
    { title: 'Kurtis', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80' },
    { title: 'Combos', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=300&q=80' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
      
      {/* 1. Round Category Bubbles */}
      <section className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-stone-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-max gap-6 sm:gap-10">
          {circularCategories.map((c, i) => (
            <div 
              key={i} 
              onClick={() => {
                const el = document.getElementById(c.title.toLowerCase());
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 border-transparent group-hover:border-[#9f2089] transition bg-gradient-to-tr from-rose-100 to-purple-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={c.img} 
                  alt={c.title} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300" 
                />
              </div>
              <span className="text-xs font-medium text-stone-700 group-hover:text-[#9f2089]">
                {c.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Banner */}
      <section className="bg-gradient-to-r from-[#9f2089] via-[#b3279c] to-[#791568] rounded-xl p-6 sm:p-10 mb-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-lg">
          <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Lowest Wholesale Price Guaranteed
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Great Quality, Lowest Prices
          </h1>
          <p className="text-xs sm:text-sm text-pink-100">
            Handcrafted pure silks and temple jewellery straight from master weavers with direct WhatsApp ordering.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
          <Truck className="w-8 h-8 text-pink-200" />
          <div className="text-left text-xs">
            <p className="font-bold">Free Delivery</p>
            <p className="text-pink-100 text-[11px]">7-Day Easy Returns</p>
          </div>
        </div>
      </section>

      {/* 3. Product Catalog Grid */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-lg font-bold text-stone-900">Products For You</h2>
          <span className="text-xs text-stone-500">{products.length} Items</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm animate-pulse">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-sm font-bold text-stone-700">No items available yet.</p>
            <Link href="/admin" className="text-xs text-[#9f2089] font-semibold mt-2 inline-block">
              + Upload first item from Mobile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((p) => {
              const origPrice = Math.round(Number(p.price) * 1.55);
              const discountPct = Math.round(((origPrice - p.price) / origPrice) * 100);
              const img = (p.images && p.images[0]) || p.image_url;

              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p)}
                  className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-stone-500 hover:text-rose-600 transition">
                      <Heart className="w-4 h-4" />
                    </button>
                    {!p.in_stock && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5 flex flex-col justify-between flex-grow">
                    <h3 className="text-xs text-stone-600 font-normal line-clamp-1 group-hover:text-[#9f2089]">
                      {p.title}
                    </h3>

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

                    <div className="pt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        4.3 <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {p.in_stock ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Full-Screen Detail View (PDP) */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex justify-center items-start sm:p-4 animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-[#f8f9fa] w-full max-w-5xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 my-0 sm:my-6 border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Header */}
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

            {/* Product Body Layout */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Image Gallery with Vertical Thumbnails */}
              <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-3">
                {/* Thumbnails */}
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

                {/* Main Large Zoomable Image */}
                <div className="flex-1 aspect-[3/4] bg-white rounded-lg border border-stone-200 overflow-hidden relative group">
                  <img
                    src={selectedImage || selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain cursor-zoom-in hover:scale-125 transition duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                    Hover to zoom
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Price, Size, Delivery, Actions */}
              <div className="lg:col-span-6 space-y-4">
                {/* Product Title Card */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2">
                  <h1 className="text-base sm:text-lg font-bold text-stone-800">
                    {selectedProduct.title}
                  </h1>

                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-stone-900">
                      ₹{selectedProduct.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{Math.round(Number(selectedProduct.price) * 1.55)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      35% off
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                      4.3 <Star className="w-3 h-3 fill-white" />
                    </span>
                    <span className="text-xs text-stone-500">
                      14,744 Ratings, 6,150 Reviews
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <span className="bg-purple-100 text-[#9f2089] text-[11px] font-bold px-2 py-0.5 rounded">
                      Gomatha Mall
                    </span>
                    <span className="text-xs text-stone-600 font-medium">
                      ✓ 100% Original Brand &bull; Authorised Seller
                    </span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-stone-700 block uppercase">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Free Size', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
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

                {/* Product Highlights */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2 text-xs">
                  <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                    Product Highlights
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1">
                    <div><span className="text-stone-400">Fabric:</span> Pure Silk / Georgette</div>
                    <div><span className="text-stone-400">Type:</span> Handloom Craft</div>
                    <div><span className="text-stone-400">Occasion:</span> Festive / Bridal</div>
                    <div><span className="text-stone-400">Blouse:</span> Running Piece Included</div>
                  </div>
                  {selectedProduct.description && (
                    <p className="text-stone-600 pt-2 border-t border-stone-100">
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                {/* Check Delivery Date */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase">
                    Check Delivery Date
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter Delivery Pincode"
                      className="border border-stone-300 px-3 py-2 text-xs rounded-md focus:outline-none focus:border-[#9f2089] flex-1"
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
                      <span>Estimated Delivery by <strong>Tomorrow, 5 PM</strong> &bull; Free Delivery</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons (Add to Cart & Buy Now) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center justify-center gap-2 border-2 border-[#9f2089] text-[#9f2089] font-bold text-xs sm:text-sm py-3 rounded-lg hover:bg-pink-50 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <a
                    href={buildWhatsAppBuyUrl(selectedProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#9f2089] hover:bg-[#851871] text-white font-bold text-xs sm:text-sm py-3 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Buy Now &rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Ratings & Customer Reviews Section */}
            <div className="bg-white border-t border-stone-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h3 className="font-bold text-base text-stone-900">
                  Product Ratings &amp; Reviews
                </h3>
              </div>

              {/* Rating Summary Breakdown Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 text-center sm:text-left space-y-1">
                  <div className="text-4xl font-extrabold text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
                    4.3 <Star className="w-7 h-7 fill-emerald-700 text-emerald-700" />
                  </div>
                  <p className="text-xs text-stone-500">14,744 Ratings, 6,150 Reviews</p>
                </div>

                {/* Percentage Distribution Bars */}
                <div className="sm:col-span-8 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-3">
                    <span className="w-16">Excellent</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[75%]" />
                    </div>
                    <span className="w-10 text-right text-stone-400">9233</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-16">Very Good</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[45%]" />
                    </div>
                    <span className="w-10 text-right text-stone-400">3313</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-16">Good</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full w-[25%]" />
                    </div>
                    <span className="w-10 text-right text-stone-400">1147</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-16">Average</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-orange-400 h-full w-[10%]" />
                    </div>
                    <span className="w-10 text-right text-stone-400">347</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-16">Poor</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-full w-[15%]" />
                    </div>
                    <span className="w-10 text-right text-stone-400">704</span>
                  </div>
                </div>
              </div>

              {/* Review Input Box */}
              <form onSubmit={handleReviewSubmit} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-700">Add Your Customer Review</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500 mr-2">Your Rating:</span>
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
                    placeholder="Your Name (e.g., Kavya Sree)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="border border-stone-300 p-2 text-xs rounded bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Fabric softness, shine, zari weight..."
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

              {/* Verified Customer Reviews */}
              <div className="divide-y divide-stone-100">
                {reviewsLoading ? (
                  <p className="text-xs text-stone-400 py-4">Loading real customer feedback...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-4">No reviews yet. Be the first to share review!</p>
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
                      <div className="flex items-center gap-4 text-[10px] text-stone-400 pt-1">
                        <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-stone-500 cursor-pointer hover:text-stone-800">
                          <ThumbsUp className="w-3 h-3" /> Helpful (157)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Checkout & Order Review Modal */}
      {showCheckout && selectedProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowCheckout(false)}
        >
          <div 
            className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Steps Header */}
            <div className="bg-[#f8f9fa] border-b border-stone-200 p-4 flex items-center justify-between">
              <span className="text-lg font-black text-[#9f2089] lowercase">gomatha</span>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-[#9f2089] border-b-2 border-[#9f2089] pb-0.5">1. Order Review</span>
                <span className="text-stone-400">2. WhatsApp Confirmation</span>
              </div>
              <button onClick={() => setShowCheckout(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Product & Address Summary */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex gap-3">
                  <img
                    src={selectedImage || selectedProduct.image_url}
                    alt=""
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="space-y-1">
                    <span className="bg-purple-100 text-[#9f2089] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Gomatha Mall
                    </span>
                    <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{selectedProduct.title}</h4>
                    <p className="text-xs font-black text-stone-900">₹{selectedProduct.price}</p>
                    <p className="text-[11px] text-stone-500">Size: {selectedSize} &bull; Qty: 1</p>
                  </div>
                </div>

                {/* Delivery Address Box */}
                <div className="border border-stone-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9f2089]" /> Delivery Address
                    </span>
                    <span className="text-[11px] text-[#9f2089] font-bold cursor-pointer">CHANGE</span>
                  </div>
                  <div className="text-xs text-stone-600 leading-relaxed">
                    <p className="font-bold text-stone-800">Customer Delivery Hub</p>
                    <p>Direct Doorstep Courier Delivery, India</p>
                    <p>Pincode: <strong>{pincode}</strong></p>
                  </div>
                </div>
              </div>

              {/* Price Details Sidebar */}
              <div className="md:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Price Details (1 Item)</h4>
                <div className="text-xs space-y-2 text-stone-600 border-b border-stone-200 pb-3">
                  <div className="flex justify-between">
                    <span>Product Price</span>
                    <span>₹{Math.round(Number(selectedProduct.price) * 1.55)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Discounts</span>
                    <span>- ₹{Math.round(Number(selectedProduct.price) * 0.55)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Delivery Charges</span>
                    <span>FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-black text-stone-900 pt-1">
                  <span>Order Total</span>
                  <span>₹{selectedProduct.price}</span>
                </div>

                <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold p-2 rounded text-center">
                  🎉 Yay! Your total discount is ₹{Math.round(Number(selectedProduct.price) * 0.55)}
                </div>

                <a
                  href={buildWhatsAppBuyUrl(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#9f2089] hover:bg-[#851871] text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 shadow transition mt-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
