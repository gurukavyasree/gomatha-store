export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-amber-100 mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-maroon-800 mb-3">
          Graceful Sarees & Divine Jewellery
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto text-sm md:text-base">
          Browse our handpicked silk sarees and bridal ornament collections directly curated for your special occasions.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/admin" className="bg-maroon-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow hover:bg-maroon-900">
            Go to Mobile Upload Portal
          </a>
        </div>
      </section>

      {/* Catalog Placeholder */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
          Latest Arrivals
        </h2>
        <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 text-sm">
            No items added yet. Use the <strong>Mobile Upload Portal</strong> to capture and upload your first saree or jewellery piece!
          </p>
        </div>
      </section>
    </div>
  );
}
