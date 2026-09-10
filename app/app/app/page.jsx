import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0; // Ensures new uploads show up immediately

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const products = await getProducts();
  // Enter your WhatsApp business number with country code (e.g., 919876543210)
  const whatsappNumber = '910000000000'; 

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-amber-100 mb-12 shadow-sm">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-maroon-800 mb-3 tracking-tight">
          Graceful Sarees & Divine Jewellery
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto text-sm md:text-base">
          Handcrafted sarees, pure silks, and temple jewellery curated directly for you.
        </p>
      </section>

      {/* Product Catalog */}
      <section>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">
            Current Collection ({products.length})
          </h2>
          <a
            href="/admin"
            className="text-xs bg-maroon-800 text-white px-3 py-1.5 rounded-full font-medium shadow hover:bg-maroon-900"
          >
            + Upload from Mobile
          </a>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-stone-300 rounded-2xl bg-white">
            <p className="text-stone-500 text-sm">
              No items uploaded yet. Open <strong>/admin</strong> on your mobile phone to snap and upload your first product!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((item) => {
              const buyMessage = encodeURIComponent(
                `Hi Gomatha Store, I am interested in purchasing: "${item.title}" (Price: ₹${item.price}). Please share more details.`
              );
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${buyMessage}`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] w-full bg-stone-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3 md:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-base font-bold text-maroon-800">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Buy
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
