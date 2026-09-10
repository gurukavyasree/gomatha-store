'use client';

import { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Product Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Products List for Deletion
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
      alert('Please snap or select an image!');
      return;
    }

    setLoading(true);
    setStatusMessage('Uploading image...');

    try {
      // 1. Cloudinary upload
      const cloudFormData = new FormData();
      cloudFormData.append('file', imageFile);
      cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'td2shx0f');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error('Cloudinary upload failed.');

      setStatusMessage('Saving product...');

      // 2. Save via API with PIN verification
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
      if (!res.ok) throw new Error(resData.error || 'Upload failed');

      setStatusMessage('Product published!');
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
    if (!confirm('Are you sure you want to remove this item from the store?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}&pin=${pin}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      
      setProducts(products.filter((p) => p.id !== id));
      alert('Item deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-maroon-800">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">Gomatha Admin Access</h2>
          <p className="text-xs text-stone-500 mb-4">Enter your secret PIN to manage items</p>
          <input
            type="password"
            placeholder="Enter Admin PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-widest text-lg p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-maroon-800 mb-4"
            required
          />
          <button type="submit" className="w-full bg-maroon-800 hover:bg-maroon-900 text-white text-sm font-semibold py-2.5 rounded-lg transition">
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard (Upload & Delete)
  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center text-xs text-stone-600 hover:text-maroon-800">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> View Live Store
      </Link>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <h1 className="text-lg font-bold text-maroon-800 mb-1">Post New Product</h1>
        <p className="text-xs text-stone-500 mb-4">Add sarees and jewellery straight to catalog.</p>

        {statusMessage && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-4 text-center cursor-pointer bg-stone-50">
              {imagePreview ? (
                <div className="relative w-full h-44">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">Change</span>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center space-y-1">
                  <Camera className="w-7 h-7 text-maroon-800" />
                  <span className="text-xs font-medium text-stone-700">Tap to snap or pick photo</span>
                </div>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" required={!imagePreview} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white">
                <option value="Sarees">Sarees</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Combos">Combos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹)</label>
              <input type="number" placeholder="4999" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-stone-300" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Item Title</label>
            <input type="text" placeholder="e.g., Pure Kanchi Pattu Saree" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-stone-300" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea rows={2} placeholder="Material, zari, stone work..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-stone-300" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-2.5 rounded-xl text-sm transition shadow disabled:opacity-50 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> {loading ? 'Posting...' : 'Publish Item'}
          </button>
        </form>
      </div>

      {/* Delete / Manage Existing Items Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <h2 className="text-base font-bold text-stone-800 mb-3">Manage & Delete Items ({products.length})</h2>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-3">
                <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-stone-50" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</h4>
                  <p className="text-[11px] text-maroon-800 font-semibold">₹{p.price} • <span className="text-stone-400 font-normal">{p.category}</span></p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                title="Delete Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
