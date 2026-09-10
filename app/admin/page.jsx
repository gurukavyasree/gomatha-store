'use client';

import { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Products state for deletion list
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim().length > 0) {
      setIsAuthenticated(true);
      fetchProducts();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please snap or select a product photo!');
      return;
    }

    setLoading(true);
    setStatusMessage('Uploading image to Cloudinary...');

    try {
      // 1. Direct Cloudinary upload
      const cloudFormData = new FormData();
      cloudFormData.append('file', imageFile);
      cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'td2shx0f');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error('Cloudinary upload failed. Please verify unsigned preset.');

      setStatusMessage('Saving to store database...');

      // 2. Save product through API with PIN
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          price,
          description,
          image_url: cloudData.secure_url,
          pin,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save product');

      setStatusMessage('Item successfully published!');
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}&pin=${pin}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setProducts(products.filter((p) => p.id !== id));
      alert('Product deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#801426]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">Gomatha Admin Access</h2>
          <p className="text-xs text-stone-500 mb-5">Enter your secret PIN to upload or delete items.</p>
          <input
            type="password"
            placeholder="Enter PIN (Default: 8899)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-widest text-lg p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426] mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#801426] hover:bg-[#670f1e] text-white text-sm font-semibold py-2.5 rounded-lg transition"
          >
            Unlock Panel
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center text-xs text-stone-600 hover:text-[#801426]">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Storefront
      </Link>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <h1 className="text-lg font-bold text-[#801426] mb-1">Upload New Item</h1>
        <p className="text-xs text-stone-500 mb-4">Snap a picture with your phone camera and publish immediately.</p>

        {statusMessage && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Product Photo *</label>
            <div className="relative border-2 border-dashed border-stone-300 hover:border-[#C59B27] rounded-xl p-4 text-center cursor-pointer bg-stone-50 overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    Change Photo
                  </span>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center space-y-1.5">
                  <Camera className="w-8 h-8 text-[#801426]" />
                  <span className="text-xs font-medium text-stone-700">Tap to snap or pick photo</span>
                  <span className="text-[10px] text-stone-400">Supports JPG, PNG, WEBP</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                required={!imagePreview}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#801426]"
              >
                <option value="Sarees">Sarees</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Combos">Combos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                placeholder="4999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Item Title *</label>
            <input
              type="text"
              placeholder="e.g., Pure Kanchi Silk Saree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Zari type, color details, blouse piece, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#801426] hover:bg-[#670f1e] text-white font-medium py-3 rounded-xl text-sm transition shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Upload & Publish to Store'}
          </button>
        </form>
      </div>

      {/* Inventory & Delete Manager */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <h2 className="text-base font-bold text-stone-900 mb-3">Manage &amp; Delete Items ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-xs text-stone-400">No products uploaded yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-[#801426] font-semibold">
                      ₹{p.price} • <span className="text-stone-400 font-normal">{p.category}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
