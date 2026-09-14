'use client';

import { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Lock, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Product Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);

  // Multi-image handling
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
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

  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select or snap at least one photo!');
      return;
    }

    setLoading(true);
    setStatusMessage(`Uploading ${selectedFiles.length} photo(s) to Cloudinary...`);

    try {
      // 1. Upload all selected images in parallel
      const uploadPromises = selectedFiles.map(async (file) => {
        const cloudFormData = new FormData();
        cloudFormData.append('file', file);
        cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'td2shx0f');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: cloudFormData }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error('One or more image uploads failed');
        return data.secure_url;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);

      setStatusMessage('Saving product to database...');

      // 2. Save via API
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          price,
          description,
          images: uploadedImageUrls,
          in_stock: inStock,
          stock_quantity: Number(stockQuantity),
          pin,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save product');

      setStatusMessage('Item successfully posted with all images!');
      setTitle('');
      setPrice('');
      setDescription('');
      setStockQuantity(1);
      setInStock(true);
      setSelectedFiles([]);
      setImagePreviews([]);
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
      const res = await fetch(`/api/products?id=${id}&pin=${pin}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setProducts(products.filter((p) => p.id !== id));
      alert('Product deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#801426]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">Gomatha Admin Access</h2>
          <p className="text-xs text-stone-500 mb-5">Enter PIN to manage inventory and photos.</p>
          <input
            type="password"
            placeholder="PIN (Default: 8899)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-widest text-lg p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801426] mb-4"
            required
          />
          <button type="submit" className="w-full bg-[#801426] hover:bg-[#670f1e] text-white text-sm font-semibold py-2.5 rounded-lg transition">
            Unlock Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center text-xs text-stone-600 hover:text-[#801426]">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Storefront
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <h1 className="text-lg font-bold text-[#801426] mb-1">Upload New Inventory</h1>
        <p className="text-xs text-stone-500 mb-4">Snap or select multiple photos, set stock, and publish.</p>

        {statusMessage && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multiple Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Images ({imagePreviews.length} selected) *
            </label>
            <div className="relative border-2 border-dashed border-stone-300 hover:border-[#C59B27] rounded-xl p-4 text-center cursor-pointer bg-stone-50">
              <div className="py-4 flex flex-col items-center space-y-1">
                <Camera className="w-7 h-7 text-[#801426]" />
                <span className="text-xs font-medium text-stone-700">Tap to snap or select multiple photos</span>
                <span className="text-[10px] text-stone-400">Add pallu, borders, jewellery angles</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 bg-white"
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
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300"
                required
              />
            </div>
          </div>

          {/* Stock and Availability Controls */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Available Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStockQuantity(val);
                  if (val === 0) setInStock(false);
                }}
                className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Availability</label>
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`w-full py-2 text-xs font-semibold rounded-lg border transition ${
                  inStock
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-red-50 text-red-700 border-red-300'
                }`}
              >
                {inStock ? '✓ In Stock' : '✕ Out of Stock'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Item Title *</label>
            <input
              type="text"
              placeholder="e.g., Pure Kanchi Silk Saree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Fabric details, zari border, color specifics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#801426] hover:bg-[#670f1e] text-white font-medium py-3 rounded-xl text-sm transition shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Uploading Images...' : 'Publish Product'}
          </button>
        </form>
      </div>

      {/* Delete & Stock Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <h2 className="text-base font-bold text-stone-900 mb-3">Inventory Manager ({products.length})</h2>
        <div className="divide-y divide-stone-100">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={(p.images && p.images[0]) || p.image_url}
                  alt={p.title}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5">
                    <span className="text-[#801426] font-semibold">₹{p.price}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${p.in_stock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {p.in_stock ? `In Stock (${p.stock_quantity ?? 1})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
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
