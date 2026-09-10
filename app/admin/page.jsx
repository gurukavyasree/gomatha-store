'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Sparkles, Filter } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Update with your actual WhatsApp business number (with country code, no '+')
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

  const categories = ['All', 'Sarees', 'Jewellery', 'Combos'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

  const sarees = products.filter((item) => item.category?.toLowerCase() === 'sarees');
  const jewellery = products.filter((item) => item.category?.toLowerCase() === 'jewellery');

  const buildWhatsAppLink = (product) => {
    const text = encodeURIComponent(
      `Hello Gomatha Store! I am interested in ordering this product:\n\n*${product.title}*\nPrice: ₹${product.price}\nView Item: ${product.image_url}`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  const renderProductCard = (item) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition duration-200"
    >
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
          {item.category}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">{item.title}</h3>
          {item.description && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-1">{item.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-base font-bold text-maroon-800">
            ₹{Number(item.price).toLocaleString('en-IN')}
          </span>
          <a
            href={buildWhatsAppLink(item)}
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
    <main className="max-w-6xl mx-auto px-4 py-6 pb-20">
      {/* Category Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-stone-200 no-scrollbar">
        <Filter className="w-4 h-4 text-stone-400 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-maroon-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400 text-sm">Loading collection...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-400 text-sm">
          No items published yet. Add your first item in the Admin panel!
        </div>
      ) : activeCategory !== 'All' ? (
        /* Filtered View */
        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">{activeCategory} Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map(renderProductCard)}
          </div>
        </section>
      ) : (
        /* Separate Categorized Views on Homepage */
        <div className="space-y-10">
          {/* Sarees Section */}
          {sarees.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500 text-amber-600" />
                  <h2 className="text-lg font-bold text-stone-900">Sarees Collection</h2>
                </div>
                <button
                  onClick={() => setActiveCategory('Sarees')}
                  className="text-xs font-semibold text-maroon-800 hover:underline"
                >
                  View All ({sarees.length})
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {sarees.map(renderProductCard)}
              </div>
            </section>
          )}

          {/* Jewellery Section */}
          {jewellery.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500 text-amber-600" />
                  <h2 className="text-lg font-bold text-stone-900">Jewellery Collection</h2>
                </div>
                <button
                  onClick={() => setActiveCategory('Jewellery')}
                  className="text-xs font-semibold text-maroon-800 hover:underline"
                >
                  View All ({jewellery.length})
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {jewellery.map(renderProductCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
