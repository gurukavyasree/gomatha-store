'use client';

import { useState } from 'react';
import { Camera, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUploadPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Handle image selection from phone camera or gallery
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
      alert('Please upload or snap a photo of the item!');
      return;
    }

    setLoading(true);
    setStatusMessage('Uploading photo...');

    try {
      // 1. Upload to Cloudinary (Free direct upload preset)
      const cloudFormData = new FormData();
      cloudFormData.append('file', imageFile);
      cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'ml_default');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudFormData,
        }
      );

      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) {
        throw new Error('Image upload failed. Check Cloudinary settings.');
      }

      setStatusMessage('Saving product details...');

      // 2. Save details into database via API
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          price,
          description,
          image_url: cloudData.secure_url,
        }),
      });

      if (!res.ok) throw new Error('Database save failed');

      setStatusMessage('Product published successfully!');
      // Reset fields
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 pb-20">
      <Link href="/" className="inline-flex items-center text-xs text-stone-600 mb-4 hover:text-maroon-800">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Store
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <h1 className="text-xl font-bold text-maroon-800 mb-1">Gomatha Admin Portal</h1>
        <p className="text-xs text-stone-500 mb-5">Snap a picture and add new inventory instantly.</p>

        {statusMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Capture / Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Photo *
            </label>
            <div className="relative border-2 border-dashed border-stone-300 hover:border-gold-500 rounded-xl p-4 text-center cursor-pointer bg-stone-50 overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    Change Photo
                  </span>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <Camera className="w-8 h-8 text-maroon-800" />
                  <span className="text-xs font-medium text-stone-700">
                    Tap to take photo or choose from gallery
                  </span>
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

          {/* Item Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-maroon-800 bg-white"
            >
              <option value="Sarees">Saree (Pattu, Silk, Cotton)</option>
              <option value="Jewellery">Jewellery (Necklace, Bangles, Haram)</option>
              <option value="Combos">Saree & Jewellery Match Combo</option>
            </select>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Item Title *</label>
            <input
              type="text"
              placeholder="e.g., Pure Kanchi Pattu Saree - Deep Red"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-maroon-800"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              placeholder="e.g., 4999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-maroon-800"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Mention weave type, zari details, blouse piece, stone work, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-maroon-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-3 rounded-xl transition shadow disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Upload & Publish to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
