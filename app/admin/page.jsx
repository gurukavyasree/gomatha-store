'use client';

import { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Edit3, Lock, ArrowLeft, CheckCircle2, X, LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Edit Mode state
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);

  // Multi-image upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [products, setProducts] = useState([]);

  const categoryOptions = [
    'Sarees',
    'Home Decor',
    'Gifts',
    'Cosmetics',
    'Bags',
    'Dresses',
    'Jewellery',
    'Fancy Items'
  ];

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('gomatha_admin_auth');
    const savedPass = sessionStorage.getItem('gomatha_admin_pass');
    if (savedAuth === 'true' && savedPass) {
      setPassword(savedPass);
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsVerifying(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('gomatha_admin_auth', 'true');
        sessionStorage.setItem('gomatha_admin_pass', password);
        fetchProducts();
      } else {
        setLoginError('Incorrect password! Only admin has access.');
      }
    } catch (err) {
      setLoginError('Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gomatha_admin_auth');
    sessionStorage.removeItem('gomatha_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
  };

  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles([...selectedFiles, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const startEditing = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price);
    setDescription(p.description || '');
    setStockQuantity(p.stock_quantity ?? 1);
    setInStock(p.in_stock ?? true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Sarees');
    setPrice('');
    setDescription('');
    setStockQuantity(1);
    setInStock(true);
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        setStatusMessage('Updating product details...');
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title,
            category,
            price,
            description,
            in_stock: inStock,
            stock_quantity: Number(stockQuantity),
            password,
          }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Update failed');
        setStatusMessage('Product updated successfully!');
        cancelEditing();
        fetchProducts();
      } else {
        if (selectedFiles.length === 0) {
          alert('Please snap or select at least one photo!');
          setLoading(false);
          return;
        }

        setStatusMessage(`Uploading ${selectedFiles.length} photo(s)...`);
        const uploadPromises = selectedFiles.map(async (file) => {
          const cloudFormData = new FormData();
          cloudFormData.append('file', file);
          cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'td2shx0f');
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: cloudFormData }
          );
          const data = await res.json();
          if (!data.secure_url) throw new Error('Cloudinary upload failed');
          return data.secure_url;
        });

        const uploadedImageUrls = await Promise.all(uploadPromises);
        setStatusMessage('Saving product to Gomatha catalog...');

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
            password,
          }),
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to save product');
        setStatusMessage('Item published successfully!');
        cancelEditing();
        fetchProducts();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}&password=${encodeURIComponent(password)}`, {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-7 sm:p-9 rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm text-center space-y-4"
        >
          <div className="w-14 h-14 bg-pink-50 text-[#9f2089] rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">
              gomatha <span className="text-[#9f2089]">admin</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter password to manage inventory across all 8 categories.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-center text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9f2089]"
            required
          />

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-[#9f2089] hover:bg-[#851871] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition"
          >
            {isVerifying ? 'Checking password...' : 'Unlock Admin Portal'}
          </button>
          <Link href="/" className="inline-block text-xs text-stone-400 hover:text-stone-700 pt-2">
            &larr; Back to Gomatha Store
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 pb-24 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs text-stone-600 hover:text-[#9f2089]">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> View Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-stone-900">
            {editingId ? 'Edit Product' : 'Upload New Inventory'}
          </h1>
          {editingId && (
            <button
              onClick={cancelEditing}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-md"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {statusMessage && (
          <div className="mb-4 p-2.5 bg-pink-50 border border-pink-200 text-[#9f2089] rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#9f2089]" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Images ({imagePreviews.length} selected) *
              </label>
              <div className="relative border-2 border-dashed border-stone-300 hover:border-[#9f2089] rounded-xl p-4 text-center cursor-pointer">
                <div className="py-4 flex flex-col items-center space-y-1">
                  <Camera className="w-7 h-7 text-[#9f2089]" />
                  <span className="text-xs font-medium text-stone-700">Tap to select or snap photos</span>
                  <span className="text-[10px] text-stone-400">Multiple image uploads supported</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 bg-white font-medium"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300"
                required
              />
            </div>
          </div>

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
              placeholder="e.g., Banarasi Silk Saree or Matte Lipstick Set"
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
              placeholder="Fabric details, color shades, material specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9f2089] hover:bg-[#851871] text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Saving...' : editingId ? 'Update Product' : 'Publish to Gomatha Store'}
          </button>
        </form>
      </div>

      {/* Inventory Manager */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
        <h2 className="text-base font-bold text-stone-900 mb-3">Manage Inventory ({products.length})</h2>
        <div className="divide-y divide-stone-100">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={(p.images && p.images[0]) || p.image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</h4>
                  <span className="text-[10px] text-[#9f2089] font-semibold">{p.category}</span>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5">
                    <span className="text-stone-900 font-bold">₹{p.price}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${p.in_stock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {p.in_stock ? `Qty: ${p.stock_quantity ?? 1}` : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEditing(p)}
                  className="text-stone-600 hover:text-stone-900 p-2 rounded-lg hover:bg-stone-100 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
